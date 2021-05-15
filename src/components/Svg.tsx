import { InstancedMeshProps, useLoader } from "@react-three/fiber"
import { map, range } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { SVGLoader } from "three-stdlib"

const { sqrt, floor, random } = Math

type Props = InstancedMeshProps & { url: string }

const SvgBase = ({ url, ...props }: Props) => {
  const { paths } = useLoader(SVGLoader, url)

  const shapeGeom = useMemo(() => {
    const shapes = paths.flatMap((p) => p.toShapes(true))
    const geom = new THREE.ShapeBufferGeometry(shapes)
    const scale = 0.013
    geom.scale(scale, scale, 0)
    return geom
  }, [paths])

  const ref = useRef<THREE.InstancedMesh>()

  const n = 666
  const len = sqrt(n)
  const halfLen = len / 2

  useLayoutEffect(() => {
    const transform = new THREE.Matrix4()
    const positions = pipe(
      range(0, n),
      map((i) => [
        (i % len) - halfLen,
        pipe(floor(i / len) - halfLen, (y) => y + (i % 2) * 0.5),
      ]),
      map(([x, y]) => [x + random() * 0.3, y + random() * 0.3])
    )
    const color = new THREE.Color()
    const blossomPalette = [0xf20587, 0xf2d479, 0xf2c879, 0xf2b077, 0xf24405]

    positions.forEach(([x, y], i) => {
      transform.setPosition(x, y, 0)
      ref.current?.setMatrixAt(i, transform)

      color.setHex(
        blossomPalette[Math.floor(Math.random() * blossomPalette.length)]
      )
      ref.current?.setColorAt(i, color)
    })
  }, [halfLen, len])

  // const [shape] = shapes
  // const ref = useRef()
  // useLayoutEffect(() => {
  //   const sphere = new THREE.Box3()
  //     .setFromObject(ref.current)
  //     .getBoundingSphere(new THREE.Sphere())
  //   ref.current.position.set(-sphere.center.x, -sphere.center.y, 0)
  // }, [])

  return (
    <instancedMesh
      ref={ref}
      args={[shapeGeom, undefined as any, n]}
      {...props}
    />
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
