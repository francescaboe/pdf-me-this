import Grid from '@mui/material/Grid';
import { Card, styled } from '@mui/material';

export const StyledGrid = styled(Grid)`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Wrapper = styled(Grid)`
  //width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FileDropBox = styled(Card)((props) => ({
  height: '500px',
  width: '500px',
  display: 'flex',
  flexDirection: 'column',
  padding: '5px',
  alignItems: 'center',
  marginBottom: '10px',
  border: `1px grey`,
  cursor: 'pointer',
  overflow: 'scroll'
}));
