import './css/style.css';
import FormConstruct from './js/FormConstruct';
window.onload = () => {
  new FormConstruct('constructor', '../php/ajax/send.php');
};