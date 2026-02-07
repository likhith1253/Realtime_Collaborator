'use client'

import Link from 'next/link'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
                        <h1 className="text-4xl font-bold">Terms of Service</h1>
                        <p className="text-muted-foreground">Last updated: February 2026</p>
                    </div>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground">
                                By accessing and using Collab, you accept and agree to be bound by the terms
                                and provision of this agreement. If you do not agree to abide by the above,
                                please do not use this service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">2. Use License</h2>
                            <p className="text-muted-foreground">
                                Permission is granted to temporarily use Collab for personal, non-commercial
                                transitory viewing only. This is the grant of a license, not a transfer of title,
                                and under this license you may not modify or copy the materials, use the materials
                                for any commercial purpose, or attempt to decompile or reverse engineer any software
                                contained on Collab.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">3. User Account</h2>
                            <p className="text-muted-foreground">
                                You are responsible for maintaining the confidentiality of your account and password
                                and for restricting access to your computer. You agree to accept responsibility for
                                all activities that occur under your account or password.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">4. Disclaimer</h2>
                            <p className="text-muted-foreground">
                                The materials on Collab are provided on an 'as is' basis. Collab makes no warranties,
                                expressed or implied, and hereby disclaims and negates all other warranties including,
                                without limitation, implied warranties or conditions of merchantability, fitness for a
                                particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold">5. Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have any questions about these Terms, please contact us at support@collab.com.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
