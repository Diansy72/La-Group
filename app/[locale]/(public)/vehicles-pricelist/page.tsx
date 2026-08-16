import Carousel from "@/components/organisms/Carousel";
import VehiclesSection from "@/features/vehicles-pricelist/VehiclesSection";
import Guide from "@/features/vehicles-pricelist/Guide";

export default function Pricelist() {
    return (
        <>
            <Guide type="pricelist" />
            <Carousel />
            <VehiclesSection />
        </>
    );
}
