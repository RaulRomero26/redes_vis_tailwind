import { driver } from "driver.js";
import 'driver.js/dist/driver.css'

export const stepsArray = [
  {
    element: '#graphButton',
    popover: {
      title: 'Opciones de Red',
      description: 'Haz clic aquí para cargar o guardar una red.',
      position: 'bottom',
      onNextClick: () => {
        // Llama al evento de la barra de navegación para abrir el menú
        const navBar = document.querySelector('#graphButton');
        if (navBar) {
          const menuButton = navBar.querySelector('#graphButton');
          if (menuButton) {
            (menuButton as HTMLElement).click();
          }
        }
        driverObj.moveNext();
      },
    },
  },
  {
    element: '#saveGraph',
    popover: {
      title: 'Guardar Red',
      description: 'Haz clic aquí para guardar la red actual.',
      position: 'bottom',
    },
  },
  {
    element: '#loadGraph',
    popover: {
      title: 'Cargar Red',
      description: 'Haz clic aquí para cargar una red desde un archivo.',
      position: 'bottom',
    },
  },
  // Agrega más pasos según sea necesario
];

export const driverObj = driver({
  animate: true,
  allowClose: false,
  doneBtnText: 'Done',
  nextBtnText: 'Next',
  prevBtnText: 'Previous',
  steps: stepsArray
});
