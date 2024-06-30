import { unstable_noStore as noStore } from 'next/cache';
import CabinCard from './CabinCard';
import { getCabins } from '../lib/data-service';

type cabin = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: boolean;
  image: string;
  length: number;
};

export default async function CabinList({ filter }: { filter: string }) {
  noStore();

  const cabins: any = await getCabins();

  if (!cabins.length) return null;

  let displayedCabins;

  if (filter === 'all') displayedCabins = cabins;
  if (filter === 'small') {
    displayedCabins = cabins.filter((cabin: cabin) => cabin.maxCapacity <= 3);
  }
  if (filter === 'medium') {
    displayedCabins = cabins.filter(
      (cabin: cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7
    );
  }
  if (filter === 'large') {
    displayedCabins = cabins.filter((cabin: cabin) => cabin.maxCapacity >= 8);
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin: any) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
