import { ReactElement } from 'react';
import './styles.scss';

export type PageProps = {
  className?: string;
  children: string | number | ReactElement | Array<ReactElement>;
  center?: boolean;
  backgroundImage?: string;
};

export const Page = (props: PageProps) => {
  const { className = '', children, center = false, backgroundImage } = props;

  return (
    <main
      className={`page-component ${className} ${center && 'page-component--center'}`}
      style={{
        ...(backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : {}),
      }}
    >
      {children}
    </main>
  );
};
