import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Advertisements = ({ categories }) => {

    const [advertisements, setAdvertisements] = useState([]);

    useEffect(() => {
        if (categories) {
            var advs = [];
            categories.forEach(cat => {
                cat.displayItems && cat.displayItems.forEach(item => {
                    advs.push({ ...item, categoryId: cat._id });
                });
            });
            setAdvertisements(advs);
        }
    }, [categories])


    return (
        <>
            {advertisements && advertisements.map((adv, i) => (
                <div key={`${adv.title}-${i}`} className="adv-card my-3">
                    <Image className="adv-card-img" src={adv.img} alt={adv.name} layout="fill" objectFit="cover"/>
                    <div className={`adv-card-content ${i % 2 == 0 ? 'float-right':''}`}>
                        <div className="adv-card-content-title">{adv.name}</div>
                        <h3 className="my-2 adv-card-content-desc">{adv.desc}</h3>
                        <Link href={`/productSearch/?category=${adv.categoryId}`} passHref>
                            <button className="btn btn-sm btn-outline-primary mt-2 mt-sm-4">Shop Now</button>
                        </Link>
                    </div>
                </div>
            ))
            }
        </>
    );
}