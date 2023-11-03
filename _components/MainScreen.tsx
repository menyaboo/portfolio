'use client'
import {useEffect, useState} from "react"
import picture from "@/public/img/dino.gif"

interface Props {
  gameMode: boolean
}

export function MainScreen({gameMode}: Props): JSX.Element {
  //инфа о кубиках
  const [isLoading, setValueLoading] = useState(true)
  const [cubesAmount, setCubesAmount] = useState(0)
  const [cubes, setCubes] =
    useState(typeof document !== 'undefined' ? document.querySelectorAll('.main__cubes-cube') : [])

  //game
  const [isGameMode, setValueGameMode] = useState(gameMode)
  const [row, setRow] = useState(0)
  const [column, setColumn] = useState(0)
  const [positionApple, setPositionApple] = useState(-1)

  //анимация
  const [isAnimate, setValueAnimate] = useState(true)
  const [cubesAnimateDelay, setCubesAnimateDelay] = useState(0)

  //логика отрисовки кубов в начале рендера страницы
  useEffect(() => {
    const row = getComputedStyle(document.documentElement).getPropertyValue('--cubes-animate-amount-in-row');
    const col = getComputedStyle(document.documentElement).getPropertyValue('--cubes-animate-amount-in-column');
    const delay = getComputedStyle(document.documentElement).getPropertyValue('--cubes-animate-delay-show-new-cube');
    setCubesAmount(+row * +col)

    if (cubesAmount != 0 && cubes.length == 0) {
      setValueLoading(false)
      setCubes(document.querySelectorAll('.main__cubes-cube'))
      setRow(+row)
      setColumn(+col)
      setCubesAnimateDelay(+delay)
    }
  })

  //useEffect для анимации кубиков
  useEffect(() => {
    // услоыия работы анимации
    if (isLoading) return
    if (!isAnimate) return
    if (isGameMode) return

    //выборка кубика без анимации
    function getCubeNoAnimateFade() {
      const cubesAnimate = document.querySelectorAll('.main__cubes-cube_fade')
      let cubesAnimateIndex: Array<number> = []
      //@ts-ignore
      cubesAnimate.forEach(el => cubesAnimateIndex.push(el.dataset.key))

      while (true) {
        const index = getRandomInt(cubes.length)
        if (cubesAnimateIndex.includes(index)) continue
        return index
      }
    }

    //анимация кубика
    const animateCube = () => cubes[getCubeNoAnimateFade()].classList.add('main__cubes-cube_fade')
    //с определенным интервалом (cubesAnimateDelay / in root) выбираем кубик и анимируем
    const animate = setInterval(() => animateCube(), cubesAnimateDelay)
    return () => clearInterval(animate)
  })

  //логика для змейки (gameMode is true)
  useEffect(() => {
    if (isLoading) return
    if (isGameMode) {

    } else return;

    //дает index элемента по координатам (x, y) / отчет с нуля
    function getIndexCube(x: number, y: number) {
      return (x * column) + y
    }

    function spawnApple() {
      if (positionApple != -1) return

      setPositionApple(getRandomInt(cubes.length))

    }



    spawnApple()
  })

  const handleKeyDown = (event: any) => {
    setPositionApple(getRandomInt(cubes.length))
    cubes[positionApple].style.backgroundColor = 'red'
    cubes[positionApple].style.opacity = '1'
  };

  //фунуции интерактива
  const cubeMouseEnter = (e: any) => e.target.classList.add('main__cubes-cube_show')
  function cubeMouseLeave(e: any) {
    e.target.classList.remove('main__cubes-cube_show')
    e.target.classList.add('main__cubes-cube_fade')
  }
  function clearAnimateFade(e: any) {
    e.target.classList.remove('main__cubes-cube_fade')
  }
  //возвращает рандомное число
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {isLoading ?
        <div className={'main'}>
          <div className={'main__content'}>

          </div>
        </div> :
        <div className={'main'}>
          <div className={'main__cubes'}
               onMouseEnter={() => isGameMode || setValueAnimate(false)}
               onMouseLeave={() => isGameMode || setValueAnimate(true)}>

            {Array.from({length: cubesAmount}, (_, i) => i++).map((key: number) => (
              <span
                data-key={key}
                key={key}
                className={'main__cubes-cube'}
                onMouseEnter={(e) => isGameMode || cubeMouseEnter(e)}
                onMouseLeave={(e) => isGameMode || cubeMouseLeave(e)}
                onAnimationEnd={(e) => clearAnimateFade(e) /*убираем класс анимации когда она отработала*/}
              ></span>
            ))}
          </div>

          {isGameMode ||
            <div className={'main__content'}>
              <div className={'container mx-auto'}>
                <div className={'main__content-title'}>
                  <h1 className="glitch" data-text="menyaeboot">menyaboo</h1>
                  <p><span style={{color: '#52525b'}}>//TODO// </span>{'___'}Расписать чтото ахереть какое важное о себе
                  </p>
                </div>
              </div>
              <div className={'main__picture'}
                   style={{
                     backgroundImage: `url(${picture.src})`,
                   }}
              ></div>
            </div>
          }

        <div onClick={() =>
          {
            setValueGameMode(!isGameMode)
            setValueAnimate(!isAnimate)
          }} className={'main__drop-menu'}></div>
        </div>


      }
    </div>
  )
}
