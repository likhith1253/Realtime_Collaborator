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
                        <p className="text-muted-foreground">Last updated: February 2026</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                            <p className="text-muted-foreground">
                                We collect information you provide directly to us, such as when you create an account,
                                use our services, or contact us for support. This may include your name, email address,
                                and any other information you choose to provide.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground">
                                We use the information we collect to provide, maintain, and improve our services,
                                to communicate with you about products, services, and events, and to protect Collab
                                and our users.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
                            <p className="text-muted-foreground">
                                We do not share, sell, or rent your personal information to third parties for their
                                marketing purposes. We may share information with service providers who assist us in
                                operating our platform, conducting our business, or servicing you.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">4. Data Security</h2>
                            <p className="text-muted-foreground">
                                We implement appropriate technical and organizational measures designed to protect
                                the security of your personal information. However, please also remember that we cannot
                                guarantee that the internet itself is 100% secure.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
                            <p className="text-muted-foreground">
                                You have the right to access, update, or delete your personal information at any time.
                                You can do this by logging into your account settings or by contacting us directly.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">6. Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have any questions about this Privacy Policy, please contact us at privacy@collab.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
