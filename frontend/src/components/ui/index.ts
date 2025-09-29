import styled from 'styled-components';
import {
  space,
  layout,
  flexbox,
  grid,
  color,
  typography,
  border,
  shadow,
  position,
  SpaceProps,
  LayoutProps,
  FlexboxProps,
  GridProps,
  ColorProps,
  TypographyProps,
  BorderProps,
  ShadowProps,
  PositionProps
} from 'styled-system';

// @ts-ignore 
import shouldForwardProp from '@styled-system/should-forward-prop';

interface GapProps {
  gap?: string | number;
}

export type BoxProps = SpaceProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  ColorProps &
  TypographyProps &
  BorderProps &
  ShadowProps &
  PositionProps &
  GapProps & {
    children?: React.ReactNode;
    as?: React.ElementType;
    variant?: string;
    size?: string;
    isLoading?: boolean;
    isDisabled?: boolean; 
  };

export const Box = styled('div').withConfig({
  shouldForwardProp,
})<BoxProps>(
  {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  space,
  layout,
  flexbox,
  grid,
  color,
  typography,
  border,
  shadow,
  position
);

export const Flex = styled(Box)({
  display: 'flex',
});

export const Grid = styled(Box)({
  display: 'grid',
});

export const Text = styled(Box)({});

export const Heading = styled(Text).attrs({ as: 'h2' })({});

export const Container = styled(Box)({
  width: '100%',
  maxWidth: '960px',
  margin: '0 auto',
  padding: '0 15px',
});

export const Button = styled(Box).attrs({ as: 'button' })({
  appearance: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
});

export const Form = styled(Box).attrs({ as: 'form' })({});

export const Input = styled(Box).attrs({ as: 'input' })({
  display: 'block',
  width: '100%',
});

export const Label = styled(Box).attrs({ as: 'label' })({
  display: 'block',
});