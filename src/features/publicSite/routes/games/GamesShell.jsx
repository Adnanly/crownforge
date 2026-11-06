import { crownforgeConfig } from "@/config/crownforge.config";
import StudioInnerPage from "../../layout/StudioInnerPage.jsx";

const GamesShell = ({ children }) => (
  <StudioInnerPage copy={crownforgeConfig.pages.games} headingId="games-page-heading">
    {children}
  </StudioInnerPage>
);

export default GamesShell;
