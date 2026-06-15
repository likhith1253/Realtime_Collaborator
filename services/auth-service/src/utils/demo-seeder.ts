import bcrypt from 'bcrypt';

export async function seedDemoWorkspace(prisma: any) {
    console.log('[DemoSeeder] Starting seeding/restoring of demo workspace...');
    
    // Check connection first
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch (err: any) {
        console.error('[DemoSeeder] Database connection failed, skipping seed:', err.message);
        return;
    }

    const demoEmail = 'demo@realtimecollaborator.com';
    // Permanent, protected password
    const hashedPassword = await bcrypt.hash('DemoPassword123!', 12);

    try {
        // 1. Find or Create Organization
        let org = await prisma.organization.findFirst({
            where: { slug: 'demo-workspace' }
        });

        if (!org) {
            org = await prisma.organization.create({
                data: {
                    name: 'Demo Workspace',
                    slug: 'demo-workspace',
                    subscription_status: 'active',
                    subscription_plan: 'enterprise'
                }
            });
            console.log(`[DemoSeeder] Created Demo organization: ${org.id}`);
        } else {
            console.log(`[DemoSeeder] Found existing Demo organization: ${org.id}`);
        }

        // 2. Find or Create Users (Demo User + Team Members)
        const usersData = [
            { email: demoEmail, full_name: 'Demo Recruiter', role: 'owner', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo' },
            { email: 'sarah.chen@realtimecollaborator.com', full_name: 'Sarah Chen (PM)', role: 'member', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            { email: 'alex.rivera@realtimecollaborator.com', full_name: 'Alex Rivera (Tech Lead)', role: 'member', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
            { email: 'jessica.taylor@realtimecollaborator.com', full_name: 'Jessica Taylor (Designer)', role: 'member', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' }
        ];

        const users: any[] = [];
        for (const ud of usersData) {
            let u = await prisma.user.findUnique({ where: { email: ud.email } });
            if (!u) {
                u = await prisma.user.create({
                    data: {
                        email: ud.email,
                        full_name: ud.full_name,
                        password_hash: hashedPassword,
                        role: ud.role,
                        avatar_url: ud.avatar_url,
                        organization_id: org.id
                    }
                });
                console.log(`[DemoSeeder] Created user: ${ud.email}`);
            } else {
                // Ensure correct organization and roles are intact
                u = await prisma.user.update({
                    where: { id: u.id },
                    data: {
                        full_name: ud.full_name,
                        role: ud.role,
                        avatar_url: ud.avatar_url,
                        organization_id: org.id
                    }
                });
            }
            users.push(u);

            // Ensure OrganizationMember link exists
            const orgMember = await prisma.organizationMember.findUnique({
                where: { organization_id_user_id: { organization_id: org.id, user_id: u.id } }
            });
            if (!orgMember) {
                await prisma.organizationMember.create({
                    data: {
                        organization_id: org.id,
                        user_id: u.id,
                        role: ud.role === 'owner' ? 'owner' : 'member'
                    }
                });
            }
        }

        const demoUser = users.find(u => u.email === demoEmail);
        const sarah = users.find(u => u.email === 'sarah.chen@realtimecollaborator.com');
        const alex = users.find(u => u.email === 'alex.rivera@realtimecollaborator.com');
        const jessica = users.find(u => u.email === 'jessica.taylor@realtimecollaborator.com');

        // 3. Clear existing workspace data (Projects, Documents, Comments, TeamMembers, Invitations, Presentations, Canvas, Messages)
        // to restore it completely to a known good state.
        const projects = await prisma.project.findMany({
            where: { organization_id: org.id }
        });
        
        console.log(`[DemoSeeder] Found ${projects.length} existing projects in demo organization. Purging...`);
        for (const proj of projects) {
            await prisma.message.deleteMany({ where: { project_id: proj.id } });
            await prisma.teamMember.deleteMany({ where: { project_id: proj.id } });
            await prisma.invitation.deleteMany({ where: { project_id: proj.id } });
            await prisma.canvas.deleteMany({ where: { project_id: proj.id } });
            
            const presentations = await prisma.presentation.findMany({ where: { project_id: proj.id } });
            for (const pres of presentations) {
                await prisma.slide.deleteMany({ where: { presentation_id: pres.id } });
            }
            await prisma.presentation.deleteMany({ where: { project_id: proj.id } });

            const docs = await prisma.document.findMany({ where: { project_id: proj.id } });
            for (const doc of docs) {
                await prisma.documentVersion.deleteMany({ where: { document_id: doc.id } });
            }
            await prisma.document.deleteMany({ where: { project_id: proj.id } });
        }
        await prisma.project.deleteMany({ where: { organization_id: org.id } });

        // 4. Create new realistic sample data
        // -- Project 1: Platform Launch Hub
        console.log('[DemoSeeder] Creating realistic project 1: Platform Launch Hub...');
        const launchProj = await prisma.project.create({
            data: {
                name: '🚀 Platform Launch Hub',
                description: 'Central hub for tracking launch milestones, documents, slide decks, and whiteboards.',
                organization_id: org.id,
                created_by: demoUser.id,
                owner_id: demoUser.id
            }
        });

        // Add team memberships
        const proj1Members = [
            { user_id: demoUser.id, role: 'owner' },
            { user_id: sarah.id, role: 'admin' },
            { user_id: alex.id, role: 'editor' },
            { user_id: jessica.id, role: 'editor' }
        ];
        for (const member of proj1Members) {
            await prisma.teamMember.create({
                data: {
                    project_id: launchProj.id,
                    user_id: member.user_id,
                    role: member.role
                }
            });
        }

        // Documents
        await prisma.document.create({
            data: {
                title: 'Product Launch Roadmap',
                project_id: launchProj.id,
                owner_id: sarah.id
            }
        });

        await prisma.document.create({
            data: {
                title: 'System Architecture Specification',
                project_id: launchProj.id,
                owner_id: alex.id
            }
        });

        // Presentation
        const presentation = await prisma.presentation.create({
            data: {
                project_id: launchProj.id,
                title: 'Investor Pitch & Product Launch',
                template: 'modern-dark'
            }
        });

        // Slides
        const slidesData = [
            { title: 'Welcome to Realtime Collaborator', content: 'Transforming how distributed product teams build software together in real-time.', order: 1 },
            { title: 'The Problem: Fragmented Tools', content: 'Teams lose hours context switching between docs, whiteboards, chat, and slides. Collaboration is slow.', order: 2 },
            { title: 'The Solution: Unified Collaboration', content: 'A high-performance workspace combining rich collaborative docs, presentations, and design boards in one interface.', order: 3 },
            { title: 'Upcoming Milestones', content: '- Beta Release: Q3\n- Stripe billing integration: Q4\n- Mobile apps: Q1 next year', order: 4 }
        ];
        for (const slide of slidesData) {
            await prisma.slide.create({
                data: {
                    presentation_id: presentation.id,
                    title: slide.title,
                    content: slide.content,
                    order: slide.order
                }
            });
        }

        // Canvas
        await prisma.canvas.create({
            data: {
                project_id: launchProj.id,
                name: 'Launch Architecture Diagram',
                data: {
                    nodes: [
                        { id: '1', type: 'custom', position: { x: 100, y: 150 }, data: { label: 'Web Frontend (Next.js)' } },
                        { id: '2', type: 'custom', position: { x: 350, y: 150 }, data: { label: 'API Gateway (Express)' } },
                        { id: '3', type: 'custom', position: { x: 600, y: 50 }, data: { label: 'Auth Service (Express + Prisma)' } },
                        { id: '4', type: 'custom', position: { x: 600, y: 250 }, data: { label: 'Collab Service (Socket.io)' } }
                    ],
                    edges: [
                        { id: 'e1-2', source: '1', target: '2', label: 'HTTP / WS' },
                        { id: 'e2-3', source: '2', target: '3', label: 'Proxy' },
                        { id: 'e2-4', source: '2', target: '4', label: 'Proxy' }
                    ]
                }
            }
        });

        // Project Chat Messages
        const chatMessages = [
            { sender_id: sarah.id, content: 'Hey everyone! Welcome to the Demo Workspace. Let\'s coordinate our Q3 launch targets here.' },
            { sender_id: alex.id, content: 'Awesome! I updated the System Architecture doc with our latest multi-service proxy and rate limiting structure.' },
            { sender_id: jessica.id, content: 'Thanks Alex. I\'ll begin adding some UI moodboards to the Canvas and check the launch pitch deck.' },
            { sender_id: demoUser.id, content: 'Hi team, checking in. Everything looks incredible. Let\'s do a dry-run of the presentation tomorrow.' }
        ];
        for (const msg of chatMessages) {
            await prisma.message.create({
                data: {
                    project_id: launchProj.id,
                    sender_id: msg.sender_id,
                    content: msg.content
                }
            });
        }

        // -- Project 2: brand assets
        console.log('[DemoSeeder] Creating realistic project 2: Creative Brand Strategy...');
        const brandProj = await prisma.project.create({
            data: {
                name: '🎨 Creative Brand Strategy',
                description: 'Brand guidelines, visual mockups, and client feedback documentation.',
                organization_id: org.id,
                created_by: demoUser.id,
                owner_id: demoUser.id
            }
        });

        // Add team memberships
        const proj2Members = [
            { user_id: demoUser.id, role: 'owner' },
            { user_id: jessica.id, role: 'admin' },
            { user_id: sarah.id, role: 'editor' }
        ];
        for (const member of proj2Members) {
            await prisma.teamMember.create({
                data: {
                    project_id: brandProj.id,
                    user_id: member.user_id,
                    role: member.role
                }
            });
        }

        // Documents
        await prisma.document.create({
            data: {
                title: 'Visual Identity Styleguide',
                project_id: brandProj.id,
                owner_id: jessica.id
            }
        });

        // Canvas
        await prisma.canvas.create({
            data: {
                project_id: brandProj.id,
                name: 'Brand Moodboard & Colors',
                data: {
                    nodes: [
                        { id: '1', type: 'color', position: { x: 50, y: 50 }, data: { color: '#6366F1', name: 'Indigo Accent' } },
                        { id: '2', type: 'color', position: { x: 200, y: 50 }, data: { color: '#10B981', name: 'Emerald Success' } },
                        { id: '3', type: 'color', position: { x: 350, y: 50 }, data: { color: '#0F0F11', name: 'Zinc Dark Background' } }
                    ]
                }
            }
        });

        console.log('[DemoSeeder] Seeding/restoring of demo workspace complete!');
    } catch (error: any) {
        console.error('[DemoSeeder] Fatal error seeding demo workspace:', error.message);
    }
}
