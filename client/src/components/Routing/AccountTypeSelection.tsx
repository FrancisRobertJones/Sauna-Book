import AuthSection from "../Homepage/RegisterAuth"

export const AccountTypeSelection = () => {

    return (
        <div className="relative z-10">
            <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
                        <div className="relative z-10 mx-auto tracking-tight max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
                            <h1 className="text-4xl font-bold sm:text-6xl mb-6">
                                Choose Your Account Type
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                It looks like you haven't set up your account type yet.
                                Please choose how you'd like to use our platform to get started.
                            </p>
                        </div>
                    </div>

                    <AuthSection />
                </div>
            </section>
        </div>
    );
};