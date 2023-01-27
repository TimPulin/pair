(() => {
  // Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.
  let arrNumbers = [];
  let arrCardsInfo = [];
  let arrOpenCards = [];
  let countMatchedCards = 0;

  function createNumbersArray(count) {
    for (let i = 1; i <= count; i++) {
      arrNumbers.push(i, i);
    }
    return arrNumbers;
  }

  // Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function createAmountCardsForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let button = document.createElement('button');

    form.classList.add('input-group', 'control');
    input.classList.add('form-control', 'control__input')
    input.placeholder = 'Количество пар карточек (от 2 до 10)';
    input.type = 'number';
    input.min = '2';
    input.max = '10';
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Начать игру';

    form.append(input);
    form.append(button);

    return {
      form,
      input,
      button,
    }
  }

  function createButtonStartAgain() {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-start-again');
    button.textContent = 'Сыграть ещё раз';
    return button;
  }

  function createGamingField() {
    let field = document.createElement('div');
    field.classList.add('field');
    field.id = 'gaming-field'
    return field;
  }

  function createGamingCard() {
    let card = document.createElement('div');
    let cardNumber =document.createElement('span');

    card.classList.add('field__card', 'field__card--closed');
    card.style.cursor = 'pointer';
    cardNumber.classList.add('field__number');

    card.append(cardNumber);
    return {
      card,
      cardNumber,
    };
  }

  function createAlertWin() {
    const alert = document.createElement('div');
    const span = document.createElement('span')
    alert.classList.add('alert-win');
    alert.id = 'alert-win';
    span.textContent = 'Вы выиграли';
    alert.append(span);
    return alert;
  }

  function createLayoutBlack() {
    const layout = document.createElement('div');
    layout.classList.add('layout-black');
    layout.id = 'layout-black';
    return layout;
  }

  function checkInputAmountCards(val) {
    if (val < 2 || val >10 || val % 2 != 0 ) {
      val = 8;
    }
    return val;
  }

  function createCardInfo(i, value, elementDOM) {
    arrCardsInfo[i] = {
      id: i + 1,
      value: value,
      statusOpen: false,
      statusMatched: false,
      elementDOM: elementDOM,
      open() {
        this.statusOpen = true;
        this.elementDOM.style.pointerEvents = 'none';
        this.elementDOM.classList.remove('field__card--closed');
        this.elementDOM.classList.add('field__card--opened');
      },
      close() {
        if (!this.statusMatched) {
          this.statusOpen = false;
          this.elementDOM.style.pointerEvents = 'auto';
          this.elementDOM.classList.remove('field__card--opened');
          this.elementDOM.classList.add('field__card--closed');
          this.elementDOM.classList.remove('field__card--unmatched');
        }
      },
      matchedReaction (matched) {
        if (matched) {
          this.statusMatched = matched;
          setTimeout( () => {
            this.elementDOM.classList.add('field__card--matched');
          }, 350);
        } else {
          this.statusMatched = matched;
          setTimeout( () => {
            this.elementDOM.classList.add('field__card--unmatched');
          }, 350)
        }
      }
    }
    return arrCardsInfo[i];
  } //createCardInfo

  function clearArr(arr) {
    arr.splice(0, arr.length);
  }

  function cardManager(card) {
    if (arrOpenCards.length === 0) {
      arrOpenCards.push(card);
      card.open();
    } else if (arrOpenCards.length === 1) {
      for (const obj of arrOpenCards) {
        card.open();
        obj.matchedReaction(compareCards(obj, card) );
        card.matchedReaction(compareCards(obj, card) );
        compareCards(obj, card) ? checkWin() : false;
      }
      arrOpenCards.push(card);
    } else {
      for (const obj of arrOpenCards) {
        obj.close();
      }
      card.open();
      clearArr(arrOpenCards);
      arrOpenCards.push(card);
    }

    function compareCards(obj, card) {
      return obj.value === card.value ? true : false;
    }

    function checkWin() {
      ++countMatchedCards;
      countMatchedCards === arrCardsInfo.length / 2 ? endingGame() : false;
    }

    function endingGame() {
      // showAlertWin();
      // formAmount.button.disabled = false;
      // formAmount.input.disabled = false;
      // buttonStartAgain.classList.add('btn-start-again--open')
      clearArr(arrCardsInfo);
      clearArr(arrNumbers);
      clearArr(arrOpenCards);
      arrOpenCards.length = 0;
      console.log(arrOpenCards);
      countMatchedCards = 0;
    }

    function showAlertWin() {
      layoutBlack.classList.add('layout-black--open');
      alertWin.classList.add('alert-win--open');
    }
  } //cardManager

  // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.
  document.addEventListener('DOMContentLoaded', function() {
    createPairsApp();
  })

  function createPairsApp() {
    let container = document.getElementById('pairsApp');
    let formAmount = createAmountCardsForm();

    const alertWin = createAlertWin();
    const layoutBlack = createLayoutBlack();
    const buttonStartAgain = createButtonStartAgain();

    container.append(formAmount.form);

    formAmount.form.addEventListener('submit', (e) => {
      e.preventDefault();
      let amount = checkInputAmountCards(formAmount.input.value);

      formAmount.input.value = amount;
      formAmount.button.disabled = true;
      formAmount.input.disabled = true;

      preparingForGame();
      startGame(amount);
    })

    buttonStartAgain.addEventListener('click', () => {
      preparingForGame();
      startGame(amount);
    })

    function startGame(count) {
      console.log(arrOpenCards);

      let cardSize;
      const fieldGame = createGamingField();
      const numbers = shuffle(createNumbersArray(count) );

      container.append(fieldGame);
      fieldGame.append(alertWin);
      fieldGame.append(layoutBlack);
      container.append(buttonStartAgain);

      for (let i = 0; i < count * 2; i++) {
        setCard(i);
      }

      function setCard(i) {
        let value = numbers[i];
        let cardGame = createGamingCard();
        let cardInfo = createCardInfo(i, value, cardGame.card);

        cardGame.card.addEventListener('click',() => {
          cardManager(cardInfo);
        } )

        cardGame.cardNumber.textContent = value;
        fieldGame.append(cardGame.card);
        cardSize = cardGame.card.offsetWidth + 'px';
        cardGame.card.style.height = cardSize;
        }

        alertWin.style.height = cardSize;
        alertWin.style.width = cardSize;
    } //startGame





    function preparingForGame() {
      checkGamingFieldExsist();
      function checkGamingFieldExsist() {
        if (document.querySelectorAll('.field').length) {
          alertWin.classList.remove('alert-win--open');
          layoutBlack.classList.remove('layout-black--open');
          buttonStartAgain.classList.remove('btn-start-again--open');
          deleteGamingField();
        }
      }
      function deleteGamingField() {
        document.getElementById('gaming-field').remove();
      }
    } //preparingForGame

  } //createPairsApp

})()//App
