
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        env[match[1]] = match[2];
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase keys in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const emailArg = process.argv[2];

    if (emailArg) {
        console.log(`Promoting ${emailArg} to ADMIN...`);
        const { data, error } = await supabase
            .from('users')
            .update({ is_admin: true })
            .eq('email', emailArg)
            .select();

        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Success:', data);
        }
    } else {
        console.log('Checking users...');
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, is_admin');
        
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.table(users);
        const admins = users.filter(u => u.is_admin);
        if (admins.length > 0) {
            console.log('\nAdmins:', admins.map(a => a.email));
        } else {
            console.log('\nNo admins found. Run: node scripts/admin-check.js <email>');
        }
    }
}

run();
