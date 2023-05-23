import Grid from '@mui/material/Grid';
import { Card, styled } from '@mui/material';

export const StyledGrid = styled(Grid)`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ListContainer = styled(Grid)`
  display: flex;
  height: 600px;
  padding: 32px;
  overflow: scroll;
  //border: 1px solid red;
`;
export const MainContent = styled(Grid)`
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 16px;
  width: 80%;
`;

export const WrapperColumn = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FileDropBox = styled(Card)((props) => ({
  height: '250px',
  width: '400px',
  display: 'flex',
  flexDirection: 'column',
  padding: '5px',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '10px',
  border: `1px dashed grey`,
  cursor: 'pointer',
  overflow: 'scroll'
}));
