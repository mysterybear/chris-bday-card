import { Fragment } from "react"
import Svg from "./Svg"

// const Threes = () => {
//   const geometry = useMemo(() => new THREE.CircleBufferGeometry(0.15, 32), [])
//   const material = useMemo(
//     () => new THREE.MeshBasicMaterial({ color: "red" }),
//     []
//   )

//   const ref = useRef<THREE.InstancedMesh>()

//   const n = 999
//   const len = sqrt(n)
//   const halfLen = len / 2

//   useLayoutEffect(() => {
//     const transform = new THREE.Matrix4()
//     const positions = pipe(
//       range(0, n),
//       map((i) => [
//         (i % len) - halfLen,
//         pipe(floor(i / len) - halfLen, (y) => y + (i % 2) * 0.5),
//       ]),
//       map(([x, y]) => [x + random() * 0.3, y + random() * 0.3])
//     )
//     positions.forEach(([x, y], i) => {
//       transform.setPosition(x, y, 0)
//       ref.current?.setMatrixAt(i, transform)
//     })
//   }, [halfLen, len])

//   return <instancedMesh ref={ref} args={[geometry, material, n]} />
// }

const App = () => {
  return (
    <Fragment>
      {/* <Threes /> */}
      <Svg url="./3.svg" filterer={(i) => i % 3 === 1} />
      <Svg url="./0.svg" filterer={(i) => i % 3 === 2} />
    </Fragment>
  )
}

export default App
