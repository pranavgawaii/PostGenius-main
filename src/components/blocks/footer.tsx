import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-background text-muted-foreground py-12 sm:py-20 border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="text-xl font-bold text-foreground tracking-tight">
                            PostGenius
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs text-muted-foreground">
                            Generate engaging captions for Instagram, LinkedIn, Twitter, and Facebook in seconds with AI.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <ActionIcon href="#" icon={<Twitter className="h-5 w-5" />} label="Twitter" />
                            <ActionIcon href="#" icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
                            <ActionIcon href="#" icon={<Github className="h-5 w-5" />} label="GitHub" />
                            <ActionIcon href="mailto:hello@postgenius.ai" icon={<Mail className="h-5 w-5" />} label="Email" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="#features">Features</FooterLink></li>
                            <li><FooterLink href="#pricing">Pricing</FooterLink></li>
                            <li><FooterLink href="#how-it-works">How It Works</FooterLink></li>
                            <li><FooterLink href="#">Examples</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="#">Blog</FooterLink></li>
                            <li><FooterLink href="#">Support</FooterLink></li>
                            <li><FooterLink href="#">Contact Us</FooterLink></li>
                            <li><FooterLink href="#faq">FAQ</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="#">About Us</FooterLink></li>
                            <li><FooterLink href="#">Privacy Policy</FooterLink></li>
                            <li><FooterLink href="#">Terms of Service</FooterLink></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col items-center gap-1 text-sm text-center">
                    <div className="text-muted-foreground">
                        Design & Developed by{' '}
                        <a
                            href="https://prnv.site"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline decoration-primary/50 underline-offset-4"
                        >
                            pranavgawai
                        </a>
                    </div>

                    <div>
                        &copy; {new Date().getFullYear()} PostGenius. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-foreground transition-colors block w-fit">
            {children}
        </Link>
    );
}

function ActionIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="p-2 rounded-full bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-all"
        >
            {icon}
        </a>
    );
}
