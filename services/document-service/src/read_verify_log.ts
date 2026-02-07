
import fs from 'fs';

try {
    const content = fs.readFileSync('verify_output.txt', 'utf-16le');
    console.log(content);
} catch (e) {
    // If utf-16le fails, try utf-8
    try {
        const content = fs.readFileSync('verify_output.txt', 'utf-8');
        console.log(content);
    } catch (e2) {
        console.error(e2);
    }
}
