import Carousel from "@/components/organisms/Carousel";
import TourSection from "@/features/tourpackages/TourSection";
import Guide from "@/features/vehicles-pricelist/Guide";

export default function TourPackages() {
  return (
    <>
      <Guide type="tours" />
      <Carousel />
      <TourSection />
    </>
  );
}
