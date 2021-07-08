import { InstancedMeshProps, useLoader } from "@react-three/fiber"
import { filter, map, range } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import { keys, toArray } from "fp-ts/lib/Record"
import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react"
import colors from "tailwindcss/colors"
import { TailwindColorGroup } from "tailwindcss/tailwind-config"
import * as THREE from "three"
import { SVGLoader } from "three-stdlib"

const { sqrt, floor, random, PI } = Math

type Props = InstancedMeshProps & {
  url: string
  filterer: (i: number) => boolean
}

const SvgBase = ({ url, filterer, ...props }: Props) => {
  const { paths } = useLoader(SVGLoader, url)

  const shapeGeom = useMemo(() => {
    const shapes = paths.flatMap((p) => p.toShapes(true))
    const geom = new THREE.ShapeBufferGeometry(shapes)
    const scale = 0.05
    geom.scale(scale, scale, 0)
    return geom
  }, [paths])

  const ref = useRef<THREE.InstancedMesh>()

  const n = 10000
  const len = sqrt(n)
  const halfLen = len / 2

  useLayoutEffect(() => {
    const positions = pipe(
      range(0, n),
      map((i) => [
        (i % len) - halfLen,
        pipe(floor(i / len) - halfLen, (y) => y + (i % 2) * 0.5),
      ]),
      map(([x, y]) => [x + random() * 0.3, y + random() * 0.3])
    )

    const color = new THREE.Color()
    const palette = pipe(
      colors,
      keys,
      filter((k) => !["black", "white"].includes(k)),
      map((k) =>
        typeof colors[k] === "string"
          ? colors[k]
          : pipe(
              toArray(colors[k] as TailwindColorGroup),
              filter(
                ([k, v]) => !["50", "100", "200", "800", "900"].includes(k)
              ),
              map(([k, v]) => v)
            )
      )
    ).flat() as string[]

    const transform = new THREE.Matrix4()

    positions.forEach(([x, y], i) => {
      if (!filterer(i)) {
        transform.makeScale(0, 0, 0)
      } else {
        const rotation = PI * 10 * random()
        const scaleFactor = 5
        const scale = 1 + (scaleFactor * random() - scaleFactor)
        const r = new THREE.Quaternion()
        r.setFromAxisAngle(
          new THREE.Vector3(random() * 0.3, random() * 0.5, 1 - random()),
          rotation
        )
        const t = new THREE.Vector3(x, y, random() * x - y)
        const s = new THREE.Vector3(scale, scale, 1)
        transform.compose(t, r, s)

        // transform.makeScale(scale, scale, 0)
        // transform.setPosition(x, y, 0)
        // transform.makeRotationZ(rotateFactor * random() - rotateFactor)
        ref.current?.setMatrixAt(i, transform)

        color.setStyle(palette[floor(random() * palette.length)])
        color.convertGammaToLinear(2.5)
        ref.current?.setColorAt(i, color)
      }
    })
  }, [filterer, halfLen, len])

  const material = useMemo(() => new THREE.MeshBasicMaterial(), [])
  material.side = THREE.DoubleSide

  return (
    <instancedMesh
      ref={ref}
      args={[shapeGeom, undefined as any, n]}
      material={material}
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
