import CardElement from './ui/CardElement.js';
import PortfolioElement from './ui/PortfolioElement.js';
import DeckElement from './ui/DeckElement.js';
import DeckBuilderElement from './ui/DeckBuilderElement.js';
import CardSlotElement from './ui/CardSlotElement.js';
import GameLaneCollectorElement from './ui/GameLaneCollectorElement.js';
import GameBoardElement from './ui/GameBoardElement.js';
import GameLogElement from './ui/GameLogElement.js';
import GameElement from './ui/GameElement.js';

customElements.define('pp-card', CardElement);
customElements.define('pp-deck', DeckElement);
customElements.define('pp-portfolio', PortfolioElement);
customElements.define('pp-cardslot', CardSlotElement);
customElements.define('pp-gamelanecollector', GameLaneCollectorElement);
customElements.define('pp-gameboard', GameBoardElement);
customElements.define('pp-gamelog', GameLogElement);
customElements.define('pp-game', GameElement);
customElements.define('pp-deckbuilder', DeckBuilderElement);
