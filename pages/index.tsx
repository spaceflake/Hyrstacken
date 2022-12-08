import Head from "next/head";
import Image from "next/image";
import Typewriter from "typewriter-effect";

import heroImg from "../public/assets/hero-img.jpg";
import TrainImage from "../public/assets/train-2.png";
import TrainMob from "../public/assets/train-mob.png";
import PussleImg from "../public/assets/pussle-img.png";
import Logo from '../public/assets/logo.png';

import FilterIcon from "../public/assets/filter-icon.svg";
import ArrowRightIcon from "../public/assets/arrow-right.svg";
import SearchIcon from "../public/assets/search-icon.svg";

import PrimaryButton from "../components/PrimaryButton/PrimaryButton";
import SecondaryButton from "../components/PrimaryButton/SecondaryButton";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

let isFirstLoad: boolean = true;

export default function Home() {
    const router = useRouter()
    const session = useSession()
    const [id, setId] = useState<string>();
    const [fireRequestModal, setFireRequestModal] = useState<boolean>(false)

    function useWindowWidth() {
        const [windowWidth, setWindowWidth] = useState<number | undefined>(
            undefined
        );

        useEffect(() => {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener("resize", handleResize);

            handleResize();

            return () => window.removeEventListener("resize", handleResize);
        });
        return windowWidth;
    }

    const windowWidth = useWindowWidth();

    useEffect(() => {
        fetch("/api/getSessionUser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(async (data) => {
            const user = await data.json();
            setId(user.id);
        })
        .catch((e) => console.log(e));
    }) 

    const useRequestModal = () => {
        useEffect(() => {
            const handler = () => {
                if(isFirstLoad && session && !session.data?.user?.name && id) {
                    isFirstLoad = false
                    setFireRequestModal(true)
                }
            }
            if (document.readyState === "complete") {
                handler();
            } else {
                window.addEventListener('load', handler);
                return () => document.removeEventListener('load', handler);
            }
        })
        return fireRequestModal
    }

    useRequestModal()

    return (
        <div className="overflow-y-hidden">
            <Head>
                <title>Hyrstacken</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="overflow-x-hidden">
                <section className="flex justify-center w-screen h-screen">
                    {windowWidth && windowWidth < 800
                    ? <Image src={Logo} alt="logotype" className="absolute top-[2rem] left-[2rem]"/>
                    : ''
                    }
                    <Image
                        src={heroImg}
                        alt="heroImage"
                        className="object-center object-cover w-full h-[100%] lg:h-[80%]"
                    />
                    <div className="absolute flex justify-center items-center left-0 top-0 h-[100%] lg:h-[80%] w-full bg-blackish bg-opacity-40" />
                    <div className="w-[100%] max-w-[1620px] left-0 absolute p-[2rem] sm:p-[4rem] flex justify-start items-center">
                        <div className="absolute top-[calc(22vh)] sm:top-[calc(25vh)] px-[0rem] min-[1460px]:px-[4rem]">
                            <p className="font-bold text-white font-cabin 2xl:text-3xl sm:text-xl">
                                HYRA ÄR DET NYA ÄGA
                            </p>
                            <h1 className="flex font-cabin font-bold text-white text-4xl 2xl:text-7xl md:text-6xl sm:text-5xl min-[460px]:text-5xl">
                                HYR
                                <span className="ml-4 text-softRed">
                                    <Typewriter
                                        options={{
                                            strings: [
                                                "EN DRÖNARE",
                                                "ETT SPEL",
                                                "EN CYKEL",
                                                "EN KAMERA",
                                                "ALLT",
                                            ],
                                            autoStart: true,
                                            loop: true,
                                        }}
                                    />
                                </span>
                            </h1>
                            <h1 className="font-cabin font-bold text-white text-4xl 2xl:text-7xl md:text-6xl sm:text-5xl min-[460px]:text-5xl">
                                ISTÄLLET FÖR
                            </h1>
                            <h1 className="font-cabin font-bold text-white text-4xl 2xl:text-7xl md:text-6xl sm:text-5xl min-[460px]:text-5xl">
                                ATT KÖPA
                            </h1>
                        </div>
                    </div>
                    <div className="absolute p-[1rem] sm:p-[4rem] left-1/2 top-[67%] min-[400px]:top-[70%] min-[800px]:top-[80%] translate-y-[-50%] translate-x-[-50%] w-[100%] flex justify-center">
                        <div className="w-[100%] max-w-[35rem] shadow-2xl bg-veryDarkBlue rounded-[8px] lg:gap-0 gap-5 flex flex-col items-center justify-between py-[1rem] px-[1rem] sm:py-[2rem] sm:px-[2rem] lg:px-[4rem] lg:flex-row lg:max-w-[75rem]">
                            <div className="flex flex-col items-center gap-[1rem] min-[375px]:flex-row lg:w-auto w-[100%]">
                                <label className="relative w-[100%] flex">
                                    <div className="absolute right-[1.5rem] top-[50%] translate-y-[-50%]">
                                        <SearchIcon />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Sök produkt..."
                                        className="p-[1rem] w-[100%] lg:w-[30rem] rounded-[8px] text-veryDarkBlue"
                                    />
                                </label>
                                <button
                                    type="button"
                                    className="border-[1px] py-[1rem] px-[2rem] min-[375px]:p-[1rem] rounded-[8px] border-white w-[100%] flex items-center justify-between min-[375px]:w-[auto]"
                                >
                                    <FilterIcon />
                                    {windowWidth && windowWidth < 375 ? (
                                        <ArrowRightIcon className="rotate-[90deg]" />
                                    ) : (
                                        ""
                                    )}
                                </button>
                            </div>
                            <div className="w-[100%] lg:w-[auto]">
                                <Link href={"/searchResults"}>
                                    <PrimaryButton styled={true}>
                                        Sök product
                                        <ArrowRightIcon />
                                    </PrimaryButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-white flex flex-col gap-10 justify-center items-center py-[5rem] px-[2rem] sm:px-[4rem]">
                    <div className="w-[100%] max-w-[1120px] flex flex-col gap-10 justify-between items-center xl:flex-row">
                        <div className="w-[100%] flex flex-col items-start">
                            <h2 className="text-3xl min-[460px]:text-4xl sm:text-5xl font-cabin font-bold text-veryDarkBlue">
                                <span className="text-softRed">HYR</span> NÄR DU
                                BEHÖVER
                            </h2>
                            <p className="w-[100%] max-w-[30rem]">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.
                            </p>
                        </div>
                        <div className="w-[100%] flex flex-col items-start">
                            <h2 className="text-3xl min-[460px]:text-4xl sm:text-5xl font-cabin font-bold text-veryDarkBlue">
                                <span className="text-softRed">DELA</span> MED
                                NÄR DU KAN
                            </h2>
                            <p className="w-[100%] max-w-[30rem]">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat.
                            </p>
                        </div>
                    </div>
                    <div className="w-[100%] max-w-[1120px] flex justify-start">
                        <SecondaryButton>Kom igång</SecondaryButton>
                    </div>
                </section>
                <section className="relative flex justify-center h-[1100px] sm:h-[1300px] 2xl:h-[1600px]">
                    {windowWidth && windowWidth > 640 ? (
                        <Image
                            src={TrainImage}
                            alt="train and mountain"
                            className="absolute top-0 left-0 object-cover h-[1300px] 2xl:h-[1600px]"
                        />
                    ) : (
                        <Image
                            src={TrainMob}
                            alt="train and mountain"
                            className="absolute top-0 left-0 object-cover h-[1100px]"
                        />
                    )}
                    <div className="absolute top-[43%] sm:top-[46%] md:top-[49%] w-[100%] px-[2rem] md:px-[4rem] max-w-[1524px] flex flex-col gap-2 md:gap-3 justify-start">
                        <p className="font-bold text-white font-cabin 2xl:text-2xl sm:text-xl">
                            GÖR SOM TUSENTALS ANDRA
                        </p>
                        <h1 className="font-cabin font-bold text-4xl 2xl:text-6xl md:text-5xl text-white max-w-[50rem]">
                            HOPPA PÅ VÅRT CIRKULÄRA PRYLTÅG MOT EN MER HÅLLBAR
                            FRAMTID
                        </h1>
                        <div className="mt-[1.5rem]">
                            <Link href={"/searchResults"}>
                                <button className="py-[1rem] px-[2rem] hover:bg-veryDarkBlue hover:text-white hover:border-veryDarkBlue transition-[250ms] rounded-[8px] border-[1px] border-white text-white flex items-center gap-10 font-medium text-lg font-nunito">
                                    Visa alla produkter
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
                <section className="w-[100%] pt-[5rem] pb-[8rem] px-[2rem] md:px-[4rem] lg:pt-[10rem] lg:pb-[12rem] flex justify-center items-center">
                    <div className="w-[100%] max-w-[1124px] flex items-center justify-between">
                        <div className="max-w-[40rem] flex flex-col gap-2">
                            <h2 className="text-3xl min-[460px]:text-4xl sm:text-5xl font-cabin font-bold text-veryDarkBlue">
                                VÅRA MÄSTARE HAR PUSSLAT IHOP ETT{" "}
                                <span className="text-softRed">TRYGGT</span> &{" "}
                                <span className="text-softRed">SÄKERT</span>{" "}
                                SÄTT ATT GÖRA AFFÄRER MED VARANDRA
                            </h2>
                            <p>
                                Genom verifiering med BankID gör du alltid
                                affärer med legitimerade personer, och med tiden
                                kommer både konsumenter och annonsörer att
                                betygsätta varandra efter deras erfarenhet och
                                upplevelse av varandra. Allt detta för att alla
                                våra användare enkelt och tryggt ska kunna lita
                                på varandra och göra hållbara affärer.
                            </p>
                        </div>
                        <Image
                            src={PussleImg}
                            alt="pussle"
                            className="hidden xl:block"
                        />
                    </div>
                </section>
            </main>
            { fireRequestModal ? 
            <Fragment>
                <div className="absolute left-0 top-0 h-full w-full bg-blackish bg-opacity-80" />
                <div className="absolute top-[45%] min-[460px]:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-8 max-w-[20rem] min-[460px]:max-w-[25rem] min-[630px]:max-w-[30rem] min-[730px]:max-w-[40rem] min-[930px]:max-w-[50rem] h-full max-h-[30rem] rounded-lg bg-white flex gap-6 flex-col justify-center items-center">
                    <h2 className="text-3xl min-[460px]:text-4xl min-[730px]:text-5xl text-center font-cabin font-bold text-softRed">Hej {session.data?.user?.email}</h2>
                    <p className="max-w-lg text-center">Sätt prägel på din profil med ett nickname och en bild, och öka chanserna att få hyra andras prylar och hyra ut dina egna.</p>
                    <div className="flex flex-col min-[460px]:flex-row gap-5">
                        <PrimaryButton onClick={() => router.push(`/profile/${id}`)}>Ja tack!</PrimaryButton>
                        <SecondaryButton onClick={() => setFireRequestModal(false)}>Senare</SecondaryButton>
                    </div>
                </div>
            </Fragment>
            :
                ''
            }
        </div>
    );
}
