import Image from "next/image";
import type { BentoTile } from "@/lib/product-bento";
import styles from "./ProductBento.module.css";

/**
 * One tile. `slot` places it on the shared grid. Three treatments:
 * - the app screenshot (`width`/`height` set) renders at its own size rather
 *   than being cropped to fill the tile;
 * - a glass tile sits on the site's real glass surface, with transparent
 *   artwork contained (not cropped) inside it — and, where `srcOnLight` is
 *   given, both ink variants render and CSS shows the right one, since the
 *   glass ground itself flips from dark to light between themes;
 * - everything else is a designed graphic meant to fill its tile exactly, so
 *   it is cropped edge to edge.
 */
function Tile({ tile }: { tile: BentoTile }) {
  const style = {
    gridColumn: tile.slot.column,
    gridRow: `${tile.slot.row} / span ${tile.slot.span}`,
  };
  const intrinsic = tile.width && tile.height;

  const classes = [styles.tile, intrinsic && styles.hug, tile.glass && styles.glass]
    .filter(Boolean)
    .join(" ");

  if (intrinsic) {
    return (
      <figure className={classes} style={style}>
        <Image
          src={tile.src}
          alt={tile.alt}
          width={tile.width}
          height={tile.height}
          className={styles.screenshot}
          sizes="(max-width: 64rem) 60vw, 22rem"
        />
      </figure>
    );
  }

  if (tile.glass && tile.srcOnLight) {
    return (
      <figure className={classes} style={style}>
        {/*
         * Both variants render and CSS shows the right one — picking in JS
         * means reading the theme after hydration, which flashes the wrong
         * ink colour on first paint. Same mechanism the ADIB logo uses.
         */}
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          className={`${styles.glassArt} ${styles.onDark}`}
          sizes="(max-width: 60rem) 30vw, 14rem"
        />
        <Image
          src={tile.srcOnLight}
          alt={tile.alt}
          fill
          className={`${styles.glassArt} ${styles.onLight}`}
          sizes="(max-width: 60rem) 30vw, 14rem"
        />
      </figure>
    );
  }

  return (
    <figure className={classes} style={style}>
      <Image
        src={tile.src}
        alt={tile.alt}
        fill
        className={tile.glass ? styles.glassArt : styles.photo}
        sizes="(max-width: 60rem) 30vw, 14rem"
      />
    </figure>
  );
}

/**
 * The value-proposition grid: designed tiles, six of them on the site's own
 * glass surface, plus one live app screenshot — sitting in the Design system
 * tab. Purely presentational — aria-hidden, since every tile's alt text
 * describes decoration alongside the prose that makes the actual case, not a
 * second source of information.
 */
export function ProductBento({ tiles, className }: { tiles: BentoTile[]; className?: string }) {
  return (
    /*
     * Two layers, not one: a CSS length like gap or padding can query the
     * INLINE-SIZE of an ancestor container, but not of the element establishing
     * that containment itself. .stage holds the containment; .grid is what is
     * actually sized and gridded, so its own cqi-based properties (gap, radius)
     * resolve correctly against .stage rather than against themselves.
     */
    <div className={className ? `${styles.stage} ${className}` : styles.stage} aria-hidden="true">
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
}
