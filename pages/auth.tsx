import { InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import {
    getCsrfToken,
    getProviders,
    getSession,
    signIn,
    ClientSafeProvider,
} from "next-auth/react";

export async function getServerSideProps(context: NextPageContext) {
    const { req } = context;
    const session = await getSession({ req });
    const providers = await getProviders();
    const csrfToken = await getCsrfToken({ req });

    if (session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        props: {
            providers,
            csrfToken,
        },
    };
}

const Auth: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers, csrfToken }) => {
    return (
        <div className="grid h-screen place-content-center">
            <div className="flex flex-col max-w-md h-[30rem]">
                <div className="flex items-center justify-center flex-grow -space-x-4">
                    <svg
                        className=" fill-mediumBlue"
                        width="21"
                        height="24"
                        viewBox="0 0 21 24"
                        fill=""
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.684 7.60539C16.831 7.60539 16.9739 7.58946 17.1107 7.55939C16.807 8.0723 16.2092 8.42113 15.5214 8.42113C14.5261 8.42113 13.7193 7.69069 13.7193 6.78966C13.7193 6.0217 14.3054 5.37768 15.0947 5.20419C14.9589 5.43348 14.8819 5.69556 14.8819 5.97392C14.8819 6.87496 15.6887 7.60539 16.684 7.60539Z"
                            fill="#EFEFEF"
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.2091 0.117613C15.0711 -0.0313426 14.8388 -0.0399677 14.6902 0.0983481C14.5416 0.236664 14.533 0.469543 14.671 0.618499C15.3652 1.36782 15.5592 2.08862 15.5758 2.60139C15.5842 2.86156 15.5469 3.06797 15.5056 3.19825C15.4947 3.2329 15.4844 3.25914 15.4761 3.27778C15.4285 3.31342 15.3895 3.36057 15.3635 3.41573C13.2037 3.82829 11.5684 5.77442 11.5684 8.11295C11.5684 9.3544 12.0292 10.4853 12.7848 11.3348C12.2552 11.1315 11.7471 11.0462 11.3267 11.0846C10.8222 10.8729 10.1719 10.5289 9.56831 10.0634C8.79919 9.47023 8.16418 8.72543 7.94071 7.86231C7.8643 7.56718 7.56365 7.39002 7.2692 7.46661C6.97475 7.5432 6.798 7.84454 6.87441 8.13967C7.18448 9.33721 8.03077 10.2708 8.89653 10.9385C9.35949 11.2955 9.84471 11.5896 10.2915 11.8186C10.2731 11.8886 10.2623 11.9617 10.2588 12.0374C9.19177 11.5511 7.87605 11.2639 6.4527 11.2639C2.88897 11.2639 0 13.0639 0 15.2843C0 17.5047 2.88897 19.3047 6.4527 19.3047C6.84363 19.3047 7.22644 19.2831 7.5982 19.2416C6.33047 20.6411 5.09199 21.359 4.8146 21.498C4.64542 21.5828 4.51963 21.735 4.46801 21.9174C4.41639 22.0998 4.4437 22.2955 4.54326 22.4567L5.29897 23.6803C5.49467 23.9972 5.9096 24.095 6.22573 23.8989C6.54186 23.7027 6.63949 23.2868 6.44379 22.97L6.05063 22.3334C6.92442 21.7677 8.41793 20.6118 9.69548 18.7609C10.1364 18.6009 10.5442 18.4093 10.9107 18.191C10.9283 18.2148 10.9477 18.2377 10.9688 18.2595C11.7567 19.0739 12.0714 20.1326 12.132 21.0396C12.1622 21.4911 12.1274 21.882 12.0691 22.1552C12.0429 22.278 12.015 22.3624 11.9941 22.4119C11.8119 22.5735 11.7271 22.826 11.7852 23.0723C11.8569 23.3769 12.1281 23.592 12.4404 23.592H14.1262C14.498 23.592 14.7994 23.2899 14.7994 22.9173C14.7994 22.5446 14.498 22.2425 14.1262 22.2425H13.4223C13.4832 21.8701 13.5073 21.4263 13.4754 20.9494C13.4013 19.8412 13.0179 18.4647 11.9768 17.3633C12.5662 16.7567 12.9054 16.0452 12.9054 15.2843C12.9054 15.1844 12.8996 15.0853 12.888 14.9871C13.9844 15.4448 15.0124 15.4042 15.3948 14.816C15.7478 14.2732 15.4532 13.4146 14.7294 12.6405C15.1971 12.8028 15.698 12.8908 16.219 12.8908C16.7822 12.8908 18.161 12.6631 18.7768 12.22C19.8611 11.44 19.2623 11.2926 18.5329 11.1131C18.2064 11.0328 17.8538 10.946 17.6141 10.7932C16.8003 10.1523 17.1491 9.56961 18.4861 10.1523C20.2301 10.7932 20.8696 9.42579 20.8696 8.11295C20.8696 5.69339 19.119 3.69389 16.848 3.37841C16.8161 3.32689 16.7719 3.28417 16.7199 3.25397C16.7158 3.2462 16.7113 3.23671 16.7064 3.22537C16.672 3.14579 16.6377 3.01188 16.6454 2.83804C16.6601 2.50463 16.8324 1.98283 17.551 1.41444C17.7102 1.28852 17.7374 1.05708 17.6117 0.897514C17.4861 0.737946 17.2552 0.710672 17.096 0.836597C16.6734 1.17086 16.3858 1.51285 16.1997 1.84353C16.0565 1.30737 15.7583 0.710439 15.2091 0.117613ZM15.5214 9.3994C16.9661 9.3994 18.1373 8.22549 18.1373 6.7774C18.1373 5.3293 16.9661 4.15539 15.5214 4.15539C14.0766 4.15539 12.9054 5.3293 12.9054 6.7774C12.9054 8.22549 14.0766 9.3994 15.5214 9.3994ZM11.9708 22.458C11.9707 22.4575 11.9735 22.4521 11.9796 22.4433C11.9741 22.4541 11.971 22.4585 11.9708 22.458Z"
                            fill=""
                        />
                    </svg>

                    <svg
                        className=" fill-mediumBlue"
                        width="194"
                        height="36"
                        viewBox="0 0 194 36"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M25.1096 30.192V6.384L29.8136 6V15.728H34.2936V6.384L38.9976 6V29.808L34.2936 30.192V20.016H29.8136V29.808L25.1096 30.192ZM46.9726 30.192V20.496L41.2126 6H46.3646L49.6606 15.984L53.2126 6H57.2446L51.7086 19.952V29.808L46.9726 30.192ZM66.0119 19.472H64.1879V29.808L59.5159 30.192V6.192L65.2119 6C67.9639 6 70.1185 6.55467 71.6759 7.664C73.2332 8.752 74.0119 10.4267 74.0119 12.688C74.0119 14.1813 73.7132 15.408 73.1159 16.368C72.5399 17.328 71.6972 18.128 70.5879 18.768L72.7319 23.984L74.9079 29.168L70.2999 30.416L66.0119 19.472ZM65.7879 16.016C66.8972 16.016 67.7612 15.792 68.3799 15.344C69.0199 14.8747 69.3399 14 69.3399 12.72C69.3399 10.736 68.3585 9.744 66.3959 9.744H64.1879V16.016H65.7879ZM83.9456 30.448C82.0043 30.448 80.3616 29.9147 79.0176 28.848C77.695 27.76 76.7243 26.3093 76.1056 24.496L80.0736 22.64L80.4576 23.28C81.0763 24.3467 81.663 25.1787 82.2176 25.776C82.7936 26.3733 83.5083 26.672 84.3616 26.672C84.9163 26.672 85.407 26.4053 85.8336 25.872C86.2816 25.3387 86.5056 24.752 86.5056 24.112C86.5056 23.5147 86.3563 22.9707 86.0576 22.48C85.759 21.9893 85.375 21.5947 84.9056 21.296L80.7136 18.8C79.4976 18.1173 78.527 17.2533 77.8016 16.208C77.0763 15.1627 76.7136 13.9893 76.7136 12.688C76.7136 11.3013 77.0336 10.064 77.6736 8.976C78.335 7.888 79.2203 7.04533 80.3296 6.448C81.4603 5.85066 82.7296 5.552 84.1376 5.552C85.7803 5.552 87.1776 5.95733 88.3296 6.768C89.4816 7.57867 90.335 8.784 90.8896 10.384L86.9216 12.176C86.8363 12.0053 86.655 11.6213 86.3776 11.024C86.1003 10.4267 85.759 10 85.3536 9.744C84.9696 9.46667 84.4896 9.328 83.9136 9.328C83.2096 9.328 82.6656 9.552 82.2816 10C81.919 10.448 81.7376 11.024 81.7376 11.728C81.7376 12.24 81.8763 12.7093 82.1536 13.136C82.4523 13.5413 82.8043 13.8613 83.2096 14.096L87.0816 16.368C89.9403 17.9893 91.4443 20.1227 91.5936 22.768C91.5936 24.2827 91.2523 25.6267 90.5696 26.8C89.9083 27.952 88.991 28.848 87.8176 29.488C86.6656 30.128 85.375 30.448 83.9456 30.448ZM97.7761 30.192V9.744H92.8801L93.2321 6H107.312L106.928 9.744H102.448V29.808L97.7761 30.192ZM108.066 30L113.122 6.288L119.81 6L124.994 29.808L119.874 30L119.01 24.848H113.282L112.258 30H108.066ZM114.146 21.008H118.146L115.938 9.52L114.146 21.008ZM134.106 30.448C131.354 30.448 129.413 29.2 128.282 26.704C127.173 24.208 126.618 21.136 126.618 17.488C126.618 15.5253 126.874 13.6373 127.386 11.824C127.898 10.0107 128.72 8.51733 129.85 7.344C131.002 6.14933 132.453 5.552 134.202 5.552C135.546 5.552 136.72 5.968 137.722 6.8C138.746 7.632 139.525 8.72 140.058 10.064C140.613 11.3867 140.89 12.7733 140.89 14.224L136.346 14.448C136.346 13.488 136.186 12.4 135.866 11.184C135.546 9.94667 134.906 9.328 133.946 9.328C132.944 9.328 132.25 10.128 131.866 11.728C131.482 13.328 131.29 15.248 131.29 17.488C131.29 20.2613 131.504 22.4907 131.93 24.176C132.357 25.84 133.178 26.672 134.394 26.672C135.248 26.672 135.856 26.1707 136.218 25.168C136.581 24.144 136.816 22.9067 136.922 21.456L140.922 21.84C140.922 23.376 140.666 24.8053 140.154 26.128C139.642 27.4293 138.874 28.4747 137.85 29.264C136.826 30.0533 135.578 30.448 134.106 30.448ZM154.985 30.416L150.825 19.248L149.001 22.416V30H144.297V6.384L149.001 6V16.496L154.697 6H159.689L154.537 15.92L159.753 29.328L154.985 30.416ZM162.328 30V6H174.52L174.136 9.744H167.032V15.472H172.088L172.056 19.504H167.032V26.256H174.776L174.392 30H162.328ZM188.997 30.192L181.989 15.184V29.808L177.797 30V6.192L182.693 6L188.901 20.272V6.384L192.869 6V29.808L188.997 30.192Z"
                            fill=""
                        />
                    </svg>
                </div>

                <h1 className="flex-grow text-3xl font-semibold text-center font-nunito">
                    Logga in / Skapa konto
                </h1>
                <form
                    method="post"
                    action="/api/auth/signin/email"
                    className="space-y-4 form-control"
                >
                    <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={csrfToken}
                    />
                    <label
                        htmlFor="email"
                        className=" input-group input-group-vertical"
                    >
                        Email
                        <input
                            className="input input-bordered"
                            id="email"
                            name="email"
                            type="text"
                            placeholder="dinmail@mail.se"
                        />
                    </label>
                    <button type="submit" className="btn btn-primary">
                        Logga in
                    </button>
                </form>
                <p className="mt-4 text-center ">
                    Klicka på länken som skickats till din mail. Kolla i din
                    skräppost om du inte ser mailet från Hyrstacken.
                </p>
                {providers &&
                    Object.values(providers).map((provider) => {
                        if (provider.name === "Email") {
                            return null;
                        }
                        return (
                            <div key={provider.name}>
                                <button
                                    className="btn"
                                    onClick={() => signIn(provider.id)}
                                >
                                    Sign in with {provider.name}
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Auth;
