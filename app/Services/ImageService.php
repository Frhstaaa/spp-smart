<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Convert an uploaded image to WebP and store it.
     * Falls back to standard storage if GD/Imagick is unavailable.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @param string $disk
     * @return string  The stored path (relative to disk root)
     */
    public static function storeAsWebp(UploadedFile $file, string $directory = 'profile-photos', string $disk = 'public'): string
    {
        if (!function_exists('imagewebp')) {
            // GD not available or old PHP — fallback to plain storage
            return $file->store($directory, $disk);
        }

        $mime = $file->getMimeType();
        $sourcePath = $file->getRealPath();

        // Create GD image resource from source
        $image = match (true) {
            str_contains($mime, 'jpeg') => @imagecreatefromjpeg($sourcePath),
            str_contains($mime, 'png')  => @imagecreatefrompng($sourcePath),
            str_contains($mime, 'gif')  => @imagecreatefromgif($sourcePath),
            str_contains($mime, 'webp') => @imagecreatefromwebp($sourcePath),
            default                     => false,
        };

        if (!$image) {
            // Fallback if image creation fails
            return $file->store($directory, $disk);
        }

        // Handle PNG transparency
        if (str_contains($mime, 'png')) {
            imagepalettetotruecolor($image);
            imagealphablending($image, true);
            imagesavealpha($image, true);
        }

        // Resize if image is larger than 1200px on any side (performance)
        $origW = imagesx($image);
        $origH = imagesy($image);
        $maxSize = 1200;

        if ($origW > $maxSize || $origH > $maxSize) {
            $ratio = min($maxSize / $origW, $maxSize / $origH);
            $newW  = (int) round($origW * $ratio);
            $newH  = (int) round($origH * $ratio);
            $resized = imagecreatetruecolor($newW, $newH);

            if (str_contains($mime, 'png')) {
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
                imagefilledrectangle($resized, 0, 0, $newW, $newH, $transparent);
            }

            imagecopyresampled($resized, $image, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
            imagedestroy($image);
            $image = $resized;
        }

        // Generate path
        $filename  = $directory . '/' . Str::uuid() . '.webp';
        $tmpPath   = sys_get_temp_dir() . '/' . Str::uuid() . '.webp';

        // Save WebP to temp file (quality 82 — great balance of size vs quality)
        imagewebp($image, $tmpPath, 82);
        imagedestroy($image);

        // Move to Storage disk
        Storage::disk($disk)->put($filename, file_get_contents($tmpPath));
        @unlink($tmpPath);

        return $filename;
    }
}
