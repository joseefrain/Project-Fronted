import { SvgComponent } from '../../assets';

export const Home = () => {
  return (
    <div className="flex flex-col items-center p-5 font-semibold text-center rounded-lg font-onest size-full">
      <h1 className="text-[28px] font-bold text-green-800">
        ¡BIENVENIDO A ZONA CONEXIÓN!
      </h1>
      <span className="w-[70%] mt-10 text-xl font-normal border-green-500 border rounded-lg p-4 shadow-lg animate-green">
        Tu destino para encontrar los mejores celulares y accesorios. Conectamos
        tu mundo con la mejor tecnología, ofreciéndote innovación, calidad y los
        precios más competitivos. Descubre lo último en smartphones, gadgets y
        complementos para estar siempre un paso adelante.
      </span>
      <SvgComponent width={400} height={400} />
    </div>
  );
};
