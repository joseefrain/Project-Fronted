import { DetailedHTMLProps, HTMLAttributes, ReactElement } from 'react';
import './styles.scss';

type TypographyComponentType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';

export type TypographyProps = {
  children: string | number | ReactElement | Array<ReactElement>;
  className?: string;
  component?: TypographyComponentType;
  bold?: boolean;
  thin?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'gray';
};

const typographyComponents = (
  component: TypographyComponentType,
  props:
    | DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
    | DetailedHTMLProps<
        HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >
) => {
  switch (component) {
    case 'p':
      return <p {...props} />;
    case 'h1':
      return <h1 {...props} />;
    case 'h2':
      return <h2 {...props} />;
    case 'h3':
      return <h3 {...props} />;
    case 'h4':
      return <h4 {...props} />;
    case 'h5':
      return <h5 {...props} />;
  }
};

export const Typography = (props: TypographyProps) => {
  const {
    className = '',
    component = 'p',
    children,
    bold = false,
    color = 'default',
    thin = false,
  } = props;

  const TypographyComponent = typographyComponents(component, {
    className: `typography ${className} ${bold && 'typography--bold'} ${thin && 'typography--thin'} typography--${color}-color`,
    children,
  });

  return TypographyComponent;
};
