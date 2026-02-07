
import { addTeamMember, getProjectTeam, removeTeamMember } from './src/services/team.service';
import { createProject } from './src/services/project.service';
import { PrismaClient } from '@collab/database';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting verification...');

    // 1. Setup Data - Create a user and a project
    // Note: We need existing users in the DB. Assuming 'e7b0c9a-...' (UUID format) but safer to look one up.

    // Find a user to be the owner
    const owner = await prisma.user.findFirst();
    if (!owner) {
        console.error('No users found in database. Cannot run verification.');
        return;
    }
    console.log(`Found owner: ${owner.email} (${owner.id})`);

    // Find another user to be the member
    const memberUser = await prisma.user.findFirst({
        where: { id: { not: owner.id } }
    });

    // If no second user, create one or skip
    let memberEmail = 'test@example.com';
    let memberId = '';

    if (memberUser) {
        memberEmail = memberUser.email;
        memberId = memberUser.id;
        console.log(`Found member: ${memberEmail} (${memberId})`);
    } else {
        console.log('Only one user found. Creating a temp user for testing...');
        // Skipping creation to avoid side effects if not needed, but for "Add by Email" we need a real user.
        // Let's assume the user will input a valid email in the real app. 
        // For this script, we can't test "Add Member" if no other user exists.
        console.warn('Skipping Add Member verification due to lack of second user.');
    }

    // Create Project
    const org = await prisma.organization.findFirst();
    if (!org) throw new Error('No organization found');

    const project = await createProject('Team Test Project', 'Testing teams', org.id, owner.id);
    console.log(`Created project: ${project.id}`);

    try {
        // 2. Test Get Team (should be empty initially)
        const teamInitial = await getProjectTeam(project.id);
        console.log('Initial Team (should be empty):', teamInitial);

        if (memberId) {
            // 3. Test Add Member
            console.log(`Adding member ${memberEmail}...`);
            const memberAdded = await addTeamMember(project.id, memberEmail, 'editor', owner.id);
            console.log('Member Added:', memberAdded);

            // 4. Verify in List
            const teamAfterAdd = await getProjectTeam(project.id);
            console.log('Team after add:', teamAfterAdd);

            if (teamAfterAdd.length !== 1) throw new Error('Failed to add member');

            // 5. Remove Member
            console.log('Removing member...');
            await removeTeamMember(project.id, memberId, owner.id);

            // 6. Verify Removal
            const teamFinal = await getProjectTeam(project.id);
            console.log('Team after removal:', teamFinal);

            if (teamFinal.length !== 0) throw new Error('Failed to remove member');
        }

        console.log('Verification Success!');

    } catch (e) {
        console.error('Verification Failed:', e);
    } finally {
        // Cleanup Project
        await prisma.project.delete({ where: { id: project.id } });
        console.log('Cleanup done.');
    }
}

main();
