import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="hero" style={{ minHeight: '100vh' }}>
            <div className="hero-content">
                <div className="sidebar-logo mb-xl" style={{ fontSize: '2rem' }}>
                    Friction
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "animate-fadeIn",
                            card: "card",
                            headerTitle: "text-xl font-semibold",
                            headerSubtitle: "text-muted",
                            formButtonPrimary: "btn btn-primary",
                            formFieldInput: "input",
                            footerActionLink: "text-primary-color",
                        },
                    }}
                />
            </div>
        </div>
    );
}
