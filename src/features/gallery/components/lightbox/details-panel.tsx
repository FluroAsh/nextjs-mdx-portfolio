"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, Download, Link2, X } from "lucide-react";

import { BilingualLabel } from "@/components/bilingual-label";
import { RecordField } from "@/components/record-field";
import { cn } from "@/utils/misc";

import { GALLERY_LABELS } from "../../labels";
import type { GalleryAlbum, GalleryPhoto } from "../../types";
import { exifFields, formatGeo, formatTakenAt } from "../../utils";
import { IconButton } from "./icon-button";

/** An album offered as a next place to go, with what it needs to show. */
export type RelatedAlbum = GalleryAlbum & {
  /** Photos in the album. */
  count: number;
  /** First photo, used as the thumbnail. */
  cover: GalleryPhoto;
};

type DetailsPanelProps = {
  photo: GalleryPhoto;
  album?: GalleryAlbum;
  related: RelatedAlbum[];
  /** Absolute URL that reopens this photo. */
  shareUrl: string;
  onDownload: () => void;
  onShowAlbum: (slug: string) => void;
};

const Section = ({
  label,
  children,
  className,
}: {
  label?: { zh: string; en: string };
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn("border-t border-green-500/15 pt-5", className)}>
    {label && <BilingualLabel {...label} className="mb-3 block" />}
    {children}
  </section>
);

const CopyLinkButton = ({ url }: { url: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timeout = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <>
      <IconButton
        label={isCopied ? "Link copied" : "Copy link to this photo"}
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setIsCopied(true);
        }}
        className={cn(isCopied && "border-green-400 text-green-300")}
      >
        {isCopied ? <Check /> : <Link2 />}
      </IconButton>
      <span role="status" className="sr-only">
        {isCopied ? "Link copied" : ""}
      </span>
    </>
  );
};

export const DetailsPanel = ({
  photo,
  album,
  related,
  shareUrl,
  onDownload,
  onShowAlbum,
}: DetailsPanelProps) => {
  const takenAt = photo.takenAt && formatTakenAt(photo.takenAt);
  const exif = photo.exif ? exifFields(photo.exif) : [];
  const geo = photo.location?.geo;

  return (
    <aside className="bg-surface-page flex flex-col gap-5 border-green-500/20 px-6 pt-5 pb-10 lg:overflow-y-auto lg:border-l lg:pt-6">
      <div className="flex items-center gap-2">
        <BilingualLabel {...GALLERY_LABELS.details} className="mr-auto" />
        <CopyLinkButton url={shareUrl} />
        <IconButton label="Download photo" onClick={onDownload}>
          <Download />
        </IconButton>
        {/* Below `lg` the stage carries the close button, nearer the thumb. */}
        <span
          aria-hidden
          className="mx-1 hidden h-6 w-px bg-green-500/20 lg:block"
        />
        <Dialog.Close asChild>
          <IconButton label="Close" className="hidden lg:grid">
            <X />
          </IconButton>
        </Dialog.Close>
      </div>

      <div>
        <Dialog.Title className="text-2xl leading-tight font-semibold text-neutral-50">
          {photo.title}
        </Dialog.Title>
        {photo.caption ? (
          <Dialog.Description className="mt-2 leading-relaxed text-neutral-300">
            {photo.caption}
          </Dialog.Description>
        ) : (
          <Dialog.Description className="sr-only">
            {photo.alt}
          </Dialog.Description>
        )}

        {photo.isSample && (
          <p className="mt-3 border border-dashed border-neutral-600 px-2.5 py-1.5 text-xs text-neutral-400">
            <BilingualLabel {...GALLERY_LABELS.sample} className="mr-2" />
            Date, GPS and EXIF here are placeholders until the uploader reads
            them from the file.
          </p>
        )}
      </div>

      {(takenAt || photo.location) && (
        <Section>
          <dl className="space-y-2">
            {takenAt && (
              <RecordField field="date">
                {takenAt.date} {takenAt.time}{" "}
                <span className="text-neutral-500">{takenAt.zone}</span>
              </RecordField>
            )}
            {photo.location && (
              <RecordField field="location">
                {photo.location.label.toUpperCase()}
              </RecordField>
            )}
            {geo && (
              <RecordField field="geo">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${geo.latitude}&mlon=${geo.longitude}#map=15/${geo.latitude}/${geo.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 underline decoration-green-500/30 underline-offset-4 hover:text-green-300 hover:decoration-green-300"
                >
                  {formatGeo(geo)}
                </a>
              </RecordField>
            )}
          </dl>
        </Section>
      )}

      {exif.length > 0 && (
        <Section label={GALLERY_LABELS.exif}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-2">
            {exif.map(({ label, value }) => (
              <div
                key={label}
                // Model names run long; a half-width cell would cut them off.
                className={cn(
                  "min-w-0",
                  (label === "CAMERA" || label === "LENS") &&
                    "col-span-2 sm:col-span-1 lg:col-span-2",
                )}
              >
                <dt className="font-mono text-[10px] tracking-wider text-neutral-500">
                  {label}
                </dt>
                <dd className="mt-0.5 truncate font-mono text-[13px] text-neutral-200 uppercase">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {photo.tags.length > 0 && (
        <Section label={GALLERY_LABELS.tags}>
          <ul className="flex flex-wrap gap-1.5">
            {photo.tags.map((tag) => (
              <li
                key={tag}
                className="border border-green-500/25 px-1.5 py-px font-mono text-[10px] tracking-wider text-neutral-300 uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {album && (
        <Section className="space-y-2">
          <button
            type="button"
            onClick={() => onShowAlbum(album.slug)}
            className={cn(
              "group flex w-full items-center justify-between border border-green-500/60 bg-green-500/10 px-4 py-3.5",
              "font-mono text-xs tracking-[0.2em] text-green-200 uppercase",
              "transition-colors duration-150 ease-linear hover:border-green-400 hover:bg-green-500/15",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400",
            )}
          >
            View album · {album.title}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          {album.postPath && (
            <Link
              href={album.postPath}
              className="group flex items-center justify-between px-1 py-1.5 font-mono text-[11px] tracking-wider text-neutral-400 uppercase hover:text-green-300"
            >
              Read the post
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </Section>
      )}

      {related.length > 0 && (
        <Section label={GALLERY_LABELS.related}>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {related.map(({ slug, title, count, cover }) => (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => onShowAlbum(slug)}
                  className={cn(
                    "group flex w-full items-center gap-3 border border-green-500/15 p-2 text-left",
                    "transition-colors duration-150 ease-linear hover:border-green-400",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400",
                  )}
                >
                  <img
                    src={cover.candidates[0]?.url ?? cover.src}
                    alt=""
                    loading="lazy"
                    className="size-12 shrink-0 object-cover grayscale transition group-hover:grayscale-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-neutral-100 uppercase group-hover:text-green-300">
                      {title}
                    </span>
                    <span className="block truncate font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
                      ?album={slug} · {count}
                    </span>
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-neutral-500 group-hover:text-green-300" />
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </aside>
  );
};
