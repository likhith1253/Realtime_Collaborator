'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BillingCancelPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-xl border shadow-lg"
            >
                <div className="flex justify-center">
                    <XCircle className="w-16 h-16 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Payment Cancelled</h1>
                    <p className="text-muted-foreground">
                        Your subscription has not been activated. No charges were made.
                    </p>
                </div>

                <div className="pt-4 space-y-3">
                    <Link href="/pricing">
                        <Button className="w-full gap-2" variant="default" size="lg">
                            Try Again
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>

                    <Link href="/dashboard">
                        <Button className="w-full" variant="ghost">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
