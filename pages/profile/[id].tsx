/* eslint-disable @next/next/no-img-element */
import { BookingStatus } from "@prisma/client";
import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Fragment, useState } from "react";
import Collapse from "../../components/Collapse/Collapse";
import ProfileForm from "../../components/Forms/ProfileForm";
import SecondaryButton from "../../components/PrimaryButton/SecondaryButton";
import RentedCard from "../../components/ProductCard/RentedCard";
import SmallProductCard from "../../components/ProductCard/SmallProductCard";
import RequestCard from "../../components/RequestCard/RequestCard";
import prisma from "../../lib/prisma";

// typed function getStaticPaths from api for user profile
export const getStaticPaths = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
        },
    });

    const paths = users.map((user) => ({
        params: { id: user.id.toString() },
    }));

    return {
        paths,
        fallback: "blocking",
    };
};

// typed function getStaticProps from api for user profile
export const getStaticProps = async ({
    params,
}: GetStaticPropsContext<{ id: string }>) => {
    if (!params) {
        return {
            notFound: true,
        };
    }
    const { id } = params;
    const session = await getSession();
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
        },
    });

    const items = await prisma.item.findMany({
        where: {
            ownerId: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            picePerDay: true,
            imageUrl: true,
            ownerId: true,
            bookings: true,
        },
    });

    const requests = await prisma.booking.findMany({
        where: {
            item: {
                owner: {
                    id,
                },
            },
        },
        include: { item: { include: { owner: true } }, renter: true },
    });

    const requestCount = await prisma.booking.count({
        where: {
            item: {
                owner: {
                    id,
                },
            },
            status: BookingStatus.PENDING,
        },
    });

    const bookingCount = await prisma.booking.count({
        where: {
            renterId: id,
            OR: [
                { status: BookingStatus.PENDING },
                { status: BookingStatus.ACCEPTED },
            ],
        },
    });

    const declinedCount = await prisma.booking.count({
        where: {
            renterId: id,

            status: BookingStatus.DECLINED,
        },
    });

    const bookings = await prisma.booking.findMany({
        where: {
            renterId: id,
        },
        select: {
            item: {
                select: {
                    id: true,
                    owner: true,
                    imageUrl: true,
                    picePerDay: true,
                    title: true,
                },
            },
            status: true,
            renter: true,
            createdAt: true,
            startDate: true,
            endDate: true,
            id: true,
            renterId: true,
        },
    });

    if (!user || !items) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            user,
            items,
            bookings,
            requests,
            requestCount,
            bookingCount,
            declinedCount,
        },
        revalidate: 1,
    };
};

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
    user,
    items,
    bookings,
    requests,
    requestCount,
    bookingCount,
    declinedCount,
}) => {
    const { data: session } = useSession();
    const [formVisible, setFormVisible] = useState(false);

    //  function treatAsUTC(date) {
    //      var result = new Date(date);
    //      result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    //      return result;
    //  }

    //  function daysBetween(startDate, endDate) {
    //      var millisecondsPerDay = 24 * 60 * 60 * 1000;
    //      return (
    //          (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
    //      );
    //  }

    return (
        <>
            <Head>
                <title>Hyrstacken - Profilsida</title>
                <meta name="description" content="Profilsida" />
            </Head>

            <div className="container max-w-2xl mx-auto font-nunito  mt-[110px]">
                <div className="flex h-24 gap-4 p-2 mt-5">
                    {user.image && user.image !== null ? (
                        <img src={user.image} alt="user" />
                    ) : (
                        <img
                            src={
                                "https://scontent.fgse1-1.fna.fbcdn.net/v/t1.18169-9/10468068_754035597969135_5397732734853413913_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=e6HWbmiHtI8AX_U28Zu&_nc_ht=scontent.fgse1-1.fna&oh=00_AfACPcRIoTp4kwKp2K9HDImCpu3bXa01cylf7HgpIdBZyQ&oe=63AD9524"
                            }
                            alt="user"
                        />
                    )}
                    <div className="self-center flex-1">
                        <h1 className="text-2xl font-extrabold">
                            {user.name || "Anonym"}
                        </h1>
                        <span>Medlem Sedan 2022</span>
                    </div>

                    {session && session.user?.email === user.email && (
                        <svg
                            width="45"
                            height="45"
                            viewBox="0 0 45 45"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cursor-pointer"
                            onClick={() => setFormVisible(!formVisible)}
                        >
                            <rect
                                x="0.5"
                                y="0.5"
                                width="44"
                                height="44"
                                rx="9.5"
                                fill="#E37E7E"
                                stroke="#E37E7E"
                            />
                            <g clipPath="url(#clip0_286_181)">
                                <path
                                    d="M24.1667 12.5C24.464 12.5003 24.75 12.6142 24.9663 12.8183C25.1825 13.0225 25.3126 13.3014 25.33 13.5983C25.3475 13.8951 25.2509 14.1874 25.06 14.4155C24.8692 14.6435 24.5984 14.79 24.3032 14.8252L24.1667 14.8333H14.8333V31.1667H31.1667V21.8333C31.167 21.536 31.2809 21.25 31.485 21.0337C31.6891 20.8175 31.9681 20.6874 32.265 20.67C32.5618 20.6525 32.8541 20.7491 33.0821 20.94C33.3102 21.1308 33.4567 21.4016 33.4918 21.6968L33.5 21.8333V31.1667C33.5002 31.7553 33.2779 32.3223 32.8776 32.754C32.4773 33.1856 31.9287 33.45 31.3417 33.4942L31.1667 33.5H14.8333C14.2447 33.5002 13.6777 33.2779 13.246 32.8776C12.8144 32.4773 12.55 31.9287 12.5058 31.3417L12.5 31.1667V14.8333C12.4998 14.2447 12.7221 13.6777 13.1224 13.246C13.5227 12.8144 14.0713 12.55 14.6583 12.5058L14.8333 12.5H24.1667ZM31.4502 12.9002C31.6601 12.6909 31.9418 12.5694 32.2381 12.5604C32.5344 12.5514 32.823 12.6554 33.0453 12.8515C33.2677 13.0475 33.407 13.3208 33.4351 13.6159C33.4632 13.911 33.378 14.2057 33.1967 14.4402L33.0998 14.551L21.5498 26.0998C21.3399 26.3091 21.0582 26.4306 20.7619 26.4396C20.4656 26.4486 20.177 26.3446 19.9547 26.1485C19.7323 25.9525 19.593 25.6792 19.5649 25.3841C19.5368 25.089 19.622 24.7943 19.8033 24.5598L19.9002 24.4502L31.4502 12.9002Z"
                                    fill="#FAFAFA"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_286_181">
                                    <rect
                                        width="28"
                                        height="28"
                                        fill="white"
                                        transform="translate(9 9)"
                                    />
                                </clipPath>
                            </defs>
                        </svg>
                    )}
                </div>
                {user.bio && (
                    <div className="p-2 m-2 mt-5 rounded-lg bg-lightGray">
                        <p className="p-2 font-normal">{user.bio}</p>
                    </div>
                )}
                {session && session.user?.email === user.email && (
                    <>
                        <div className="px-2 pb-5 mt-10 ">
                            <SecondaryButton
                                onClick={() => {
                                    signOut({
                                        callbackUrl: `${window.location.origin}`,
                                    });
                                }}
                            >
                                Logga ut
                            </SecondaryButton>
                        </div>
                        {formVisible && (
                            <ProfileForm
                                id={user.id}
                                name={user.name}
                                image={user.image}
                                bio={user.bio}
                                setFormVisible={setFormVisible}
                            />
                        )}
                    </>
                )}
                <Collapse
                    title={
                        session && session.user?.email === user.email
                            ? "Mina annonser"
                            : "Annonser"
                    }
                    length={items.length}
                    disabled={items.length === 0}
                >
                    <div className="flex flex-col w-full py-10 gap-y-4">
                        {items.map((item, index) => (
                            <Link
                                tabIndex={index}
                                key={item.id}
                                href={`/product/${item.id} `}
                                className="grow"
                            >
                                <SmallProductCard item={item} />
                            </Link>
                        ))}
                    </div>
                </Collapse>
                {session && session.user?.email === user.email && (
                    <>
                        {requests && (
                            <Collapse
                                title="Förfrågningar"
                                length={requestCount}
                                disabled={requestCount === 0}
                            >
                                <>
                                    {requests.map((request) => {
                                        return (
                                            request.status ===
                                                BookingStatus.PENDING && (
                                                <Fragment key={request.id}>
                                                    <RequestCard
                                                        createdAt={
                                                            request.createdAt
                                                        }
                                                        itemName={
                                                            request.item.title
                                                        }
                                                        startDate={
                                                            request.startDate
                                                        }
                                                        endDate={
                                                            request.endDate
                                                        }
                                                        renter={
                                                            request.renter.name
                                                        }
                                                        renterImg={
                                                            request.renter.image
                                                        }
                                                        status={request.status}
                                                        bookingId={request.id}
                                                        itemId={request.itemId}
                                                    />
                                                </Fragment>
                                            )
                                        );
                                    })}
                                </>
                            </Collapse>
                        )}
                        <Collapse
                            title="Hyrda prylar"
                            length={bookingCount}
                            disabled={bookingCount === 0}
                        >
                            <div className="flex flex-col w-full py-10 gap-y-4">
                                {bookings.map(
                                    (booking) =>
                                        booking.status !==
                                            BookingStatus.DECLINED && (
                                            <Fragment key={booking.id}>
                                                <RentedCard
                                                    bookingId={booking.id}
                                                    itemId={booking.item.id}
                                                    itemImage={
                                                        booking.item.imageUrl
                                                    }
                                                    itemTitle={
                                                        booking.item.title
                                                    }
                                                    pricePerDay={
                                                        booking.item.picePerDay
                                                    }
                                                    startDate={
                                                        booking.startDate
                                                    }
                                                    endDate={booking.endDate}
                                                    ownerName={
                                                        booking.item.owner.name
                                                    }
                                                    ownerImage={
                                                        booking.item.owner.image
                                                    }
                                                    ownerId={booking.item.owner.id}
                                                    status={booking.status}
                                                />
                                            </Fragment>
                                        )
                                )}
                            </div>
                        </Collapse>
                        <Collapse
                            title="Nekade ordrar"
                            length={declinedCount}
                            disabled={declinedCount === 0}
                        >
                            <div className="flex flex-col w-full py-10 gap-y-4">
                                {bookings.map(
                                    (booking) =>
                                        booking.status ===
                                            BookingStatus.DECLINED && (
                                            <Fragment key={booking.id}>
                                                <RentedCard
                                                    bookingId={booking.id}
                                                    itemId={booking.item.id}

                                                    itemImage={
                                                        booking.item.imageUrl
                                                    }
                                                    itemTitle={
                                                        booking.item.title
                                                    }
                                                    pricePerDay={
                                                        booking.item.picePerDay
                                                    }
                                                    startDate={
                                                        booking.startDate
                                                    }
                                                    endDate={booking.endDate}
                                                    ownerName={
                                                        booking.item.owner.name
                                                    }
                                                    ownerImage={
                                                        booking.item.owner.image
                                                    }
                                                    ownerId={booking.item.owner.id}
                                                    status={booking.status}
                                                />
                                            </Fragment>
                                        )
                                )}
                            </div>
                        </Collapse>
                    </>
                )}
            </div>
        </>
    );
};

export default ProfilePage;
