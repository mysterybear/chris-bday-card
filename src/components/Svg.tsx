import { useLoader } from "@react-three/fiber"
import React, { Suspense, useMemo } from "react"
import { SVGLoader } from "three-stdlib"

type Props = { url: string }

const SvgBase = ({ url }: Props) => {
  const { paths } = useLoader(SVGLoader, url)
  const shapes = useMemo(
    () =>
      paths.flatMap((p) =>
        p.toShapes(true).map((shape) => ({
          shape,
          color: p.color,
          // fillOpacity: p.userData.style.fillOpacity,
        }))
      ),
    [paths]
  )

  const [shape] = shapes
  // const ref = useRef()
  // useLayoutEffect(() => {
  //   const sphere = new THREE.Box3()
  //     .setFromObject(ref.current)
  //     .getBoundingSphere(new THREE.Sphere())
  //   ref.current.position.set(-sphere.center.x, -sphere.center.y, 0)
  // }, [])

  return (
    <mesh>
      <shapeBufferGeometry args={[shape.shape]} />
      <meshBasicMaterial color={shape.color} />
    </mesh>
  )
}

const Svg = (props: Props) => {
  return (
    <Suspense fallback={null}>
      <SvgBase {...props} />
    </Suspense>
  )
}

export default Svg
