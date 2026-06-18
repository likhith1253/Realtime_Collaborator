'use client'

import Link from 'next/link'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navigation />

            <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">Privacy Policy</h1>
                        <p className="text-muted-foreground">Last updated: June 2026</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                            <p className="text-muted-foreground">
                                We collect information you provide directly, including account credentials, profile details, 
                                and content you create or upload. We also collect technical data such as IP addresses, 
                                device information, and usage patterns to improve our collaboration platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground">
                                We use your information to deliver real-time collaboration features, synchronize documents 
                                across devices, provide AI-powered assistance, and maintain platform security. We also use 
                                data to improve service reliability and user experience.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
                            <p className="text-muted-foreground">
                                We do not sell your personal information. Content you create is shared only with collaborators 
                                you explicitly authorize. We may share data with service providers essential to operating 
                                our platform (e.g., cloud infrastructure, analytics) under strict data protection agreements.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">4. Data Security</h2>
                            <p className="text-muted-foreground">
                                We implement industry-standard encryption for data in transit and at rest. Your documents 
                                and collaboration data are stored in secure cloud environments with access controls, 
                                regular security audits, and compliance with data protection regulations.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
                            <p className="text-muted-foreground">
                                You can access, modify, or delete your account data through platform settings. You may also 
                                export your documents and collaboration data. For data deletion requests, contact us through 
                                your account settings or at privacy@collab.com.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">6. Data Retention</h2>
                            <p className="text-muted-foreground">
                                We retain your data for as long as necessary to provide our services. When you delete your 
                                account, we remove your personal information from our active systems within a reasonable 
                                timeframe, unless required by law to retain certain records.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">7. Contact Us</h2>
                            <p className="text-muted-foreground">
                                For privacy-related inquiries, contact us through your account settings or at 
                                privacy@collab.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
