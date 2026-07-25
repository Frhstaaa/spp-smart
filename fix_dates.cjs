const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            const replacements = [
                'payment.payment_date',
                'tx.payment_date',
                'currentBill.due_date',
                'bill.due_date',
                'task.due_date',
                'user.join_date'
            ];
            replacements.forEach(r => {
                const search = 'new Date(' + r + ')';
                const replace = 'new Date(String(' + r + ').replace(/ /g, "T"))';
                if (content.includes(search)) {
                    content = content.split(search).join(replace);
                    modified = true;
                }
            });
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed dates in', fullPath);
            }
        }
    });
}
walk('./resources/js');
