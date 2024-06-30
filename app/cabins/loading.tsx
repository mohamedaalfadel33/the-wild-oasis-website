import Spinner from '../../components/Spinner';

export default function loading() {
  return (
    <div className=" grid items-center justify-center">
      <Spinner />
      <p className="text-xl text-primary-200">Loading cabins data...</p>
    </div>
  );
}
