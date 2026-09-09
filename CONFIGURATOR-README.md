# Component Configurator — what it is and how to publish it

A single web page that lets a customer pick a product from your printed supplier
catalogue and build the exact order code for it, then send you the request.

**Published as** `public/tools/component-configurator.html` (9.9 MB, 735 KB over the
wire once gzipped) plus `public/tools/component-configurator/` — 2,416 drawings and
photographs as ordinary image files. The site route `/tools/component-configurator`
frames it with the JIDOKA header, breadcrumbs and quotation call-to-action; the page
itself also opens standalone.

Built on 7 September 2026 from the 51 supplier catalogue PDFs held offline in
`D:\Catalogue Understanding` (the PDFs and the build tooling are deliberately not in git).

---

## What is in it

| | |
|---|---|
| Catalogue sections | **50** |
| Catalogue pages transcribed | **1,040** |
| Product families | **1,227** |
| Orderable codes | **3,311** |

Every page of every catalogue was read and its ordering tables copied in full —
all rows, all columns, plus the footnotes, the optional-processing codes and the
ordering examples printed in the book.

## What a customer can do on the page

- **Pick a catalogue section**, then a product family from the list (each with its photo).
- **See the dimensioned drawing and the product photo** for the family, click either to enlarge.
- **Choose type/material**, then work through one step per selection the catalogue asks
  for (bore, length, tolerance, thread, and so on). Only the combinations the catalogue
  actually lists are offered, so an impossible code cannot be built.
- **Add optional processing** where the catalogue offers it.
- **Get the finished part number**, and copy it.
- **Build a quotation list** of several items, then *Copy as CSV* to paste into Excel.
- **Send the request** with *Email request* or *WhatsApp*.
- **Check an existing part number** — paste a code and the page decodes it back into
  the product, the selections and the catalogue page it came from.
- **Copy link** — produces a link that reopens the page with that exact part number loaded,
  handy for sending a customer straight to a configured item.

## Before you publish: fill in your details

Open `shaft-configurator.html` in Notepad (or any text editor), and near the top of the
file you will find this block. Fill in the blanks and save — nothing else needs touching.

```js
const SITE = {
  company: "",        // e.g. "S S Enterprises"  (shown above the title and in the footer)
  tagline: "",        // e.g. "Industrial automation components, Pune"
  phone: "",          // e.g. "+91 98765 43210"
  whatsapp: "",       // digits only with country code, e.g. "919876543210"
  email: "",          // quotation requests are emailed here
  website: "",        // e.g. "https://www.example.com"
  address: "",
  disclaimer: "Part numbers are generated from the printed catalogue tables and may contain reading errors. Please confirm the code and dimensions against the catalogue before ordering."
};
```

If you leave `email` and `whatsapp` blank the page still works — the customer is asked
to supply the contact instead.

## How it is published

The page lives in the website repository and goes live with the rest of the site - there is
nothing to upload by hand:

| | |
|---|---|
| Page | `public/tools/component-configurator.html` |
| Images | `public/tools/component-configurator/` (2,416 files) |
| Site route | `/tools/component-configurator` |
| Menu | Engineering mega-menu and the footer, as "Component Configurator" |

### Every product links back to its catalogue

Each of the 50 catalogue sections is mapped to the JIDOKA catalogue product its pages were
transcribed from, so nothing in the configurator is shown without a route back to the book
it came from:

- In the configurator, the **Catalogue** row of the specification panel and the caption above
  the drawing both link to that product's page on the site (which carries the catalogue
  download), alongside the printed page number.
- On each product page, **Build a part number** opens the configurator already on that
  product's catalogue section (`/tools/component-configurator?cat=<key>`).
- The quotation list hands off to `/request-a-quote` with the codes prefilled.

The mapping is `data/catalogueSections.ts` in the website repo — one line per section, with
the family and code counts and a note wherever a source PDF's filename disagrees with what
its pages actually contain (three of them do). `publish_web.py` reads that file and fails
loudly if a section has no mapping, so a new catalogue cannot go live unlinked.

Two catalogue products have no section because their pages were not transcribed: Conveyor &
Gripping Units, and Universal Joints (which shares the Disc Couplings book). Cutters was
likewise left out of this build.

### The images are stored beside the page, not inside it

The generated page originally carried every drawing and photograph inside itself as base64,
which made one self-contained 54 MB file - convenient to drag into a web host's file manager,
but far too heavy to keep in git and slow on a phone.

`publish_web.py` writes those images out as normal files instead and points the page at them.
The result:

| | Single file | Page + image folder |
|---|--:|--:|
| Page a visitor downloads first | 54 MB | **9.9 MB** (735 KB gzipped) |
| Images | inside the page, all 54 MB up front | fetched only when shown, then cached |
| Repeat visits | re-downloads everything | page only, images already cached |

Each image is named after a hash of its own content, so identical crops are stored once, the
files can be cached forever, and rebuilding after a data correction only rewrites the pictures
that actually changed rather than churning a fresh 54 MB blob through git.

Splitting into one page per catalogue is still possible on top of this if the 9.9 MB of
catalogue tables ever needs to come down further - it would cost the ability to search and
decode part numbers across all 50 catalogues at once, which is why it was not done now.

## Please check these before you rely on the codes

The transcription flags anything that looked wrong on the printed page rather than
silently "fixing" it. Roughly thirty cells need your eye against the paper catalogue;
they are recorded in the data files and reported by the validator. The main ones:

- **Bearings and Cam Followers** — several rows where the bore printed in the table does
  not match the bearing number and bolt size beside it; one load figure printed as
  3.6 kN where the pattern suggests 0.36.
- **Springs** — two round-wire rows whose force drops as the spring gets longer, and one
  wire diameter that breaks the sequence.
- **Single Axis Robots** — three models whose maximum stroke differs between the ordering
  table and the specification table on the facing page (100~1050 vs 100~1250 / 100~1500).
- **Aluminium Profiles** — four accessory codes printed twice in the book with different
  weights each time; both versions are kept separately until you decide which is right.
- **Rotation Shafts** — one blank length cell, and a rule printed as `6 ≤ F ≤ Q×7`
  where its companion rule uses ×6.
- Various order-box typos where the example code does not match the table on the same
  page (noted in the data, not propagated into the configurator).

Every product also carries the catalogue page number, so anything can be checked against
the book in seconds.

## The catalogue sections

| Catalogue section | Pages | Families | Codes |
|---|--:|--:|--:|
| Post Stands, Struts and Clamps | 35 | 62 | 240 |
| Aluminium Profiles | 121 | 139 | 210 |
| Bearings and Cam Followers | 45 | 53 | 202 |
| Positioning and Guide Components | 24 | 31 | 194 |
| Rotation Shafts | 25 | 25 | 147 |
| Rollers (2) | 17 | 23 | 128 |
| Positioning Pins and Guide Bushes | 30 | 39 | 126 |
| Timing Pulleys | 29 | 28 | 123 |
| Chains and Sprockets | 22 | 36 | 110 |
| Pulleys and Idlers | 17 | 26 | 106 |
| Hinges | 48 | 76 | 104 |
| Linear Bushings | 17 | 18 | 97 |
| Shaft Collars | 13 | 19 | 96 |
| Linear Shafts | 20 | 23 | 90 |
| Pneumatic Clamps | 23 | 42 | 86 |
| Vacuum Suckers | 22 | 39 | 84 |
| Hinges and Cantilever Pins | 12 | 15 | 77 |
| Handles | 24 | 41 | 75 |
| Door Latches | 32 | 35 | 74 |
| Casters | 32 | 34 | 64 |
| Gear Racks | 13 | 12 | 57 |
| Small Components | 9 | 17 | 56 |
| Mounted Support Bearings | 13 | 17 | 56 |
| Manual Displacement Tables | 44 | 46 | 55 |
| Shaft Supports | 7 | 11 | 54 |
| Fasteners | 24 | 35 | 51 |
| Springs | 46 | 40 | 49 |
| Single Axis Robots | 80 | 41 | 48 |
| Oil-Free Bushings | 15 | 21 | 46 |
| Pneumatic Parts | 7 | 10 | 44 |
| Flat Belts | 9 | 10 | 42 |
| Washers and Shaft Collars | 5 | 5 | 32 |
| Disc Couplings | 17 | 13 | 30 |
| Sealing Rings | 3 | 5 | 28 |
| Pneumatic Joints and Speed Valves | 8 | 14 | 27 |
| Trapezoidal Screws | 15 | 18 | 25 |
| Timing Belts | 11 | 9 | 23 |
| Drag Chains | 7 | 14 | 21 |
| Linear Guide Rails | 9 | 9 | 18 |
| Rollers | 5 | 9 | 16 |
| Shock Absorbers and Protectives | 5 | 7 | 16 |
| Other Functional Parts | 11 | 8 | 15 |
| Vacuum Generators and Pressure Switches | 5 | 5 | 11 |
| Ball Screw Supports | 20 | 10 | 10 |
| Ball Screw Supports (2) | 9 | 10 | 10 |
| Gripping Components | 21 | 9 | 10 |
| Dampers | 8 | 10 | 10 |
| Heat Insulating Plates | 2 | 2 | 8 |
| Ducts and Hoses | 1 | 2 | 6 |
| Nozzles | 3 | 4 | 4 |
| **Total** | **1040** | **1227** | **3311** |

## Rebuilding after a data correction

The page is generated, so corrections are made to the data and the page is rebuilt —
never edited by hand.

```
cd "D:\Catalogue Understanding\configurator"
python check.py <catalogue-key>     # validates one section, must end "FILES WITH PROBLEMS: 0"
python build.py                     # re-crops every drawing, rewrites catalogue.json
python publish_web.py               # writes the page + images into D:\Website
```

`build.py` still writes the self-contained `configurator\shaft-configurator-standalone.html`
if a single-file copy is ever wanted. `publish_web.py` is what feeds the website: it reads
the same `catalogue.json`, writes the images into `public/tools/component-configurator/`,
removes any that are no longer referenced, and writes the page — then commit the result.

Source data lives in `configurator\data\<catalogue-key>\pNN.json`, one file per
catalogue page. `configurator\data\SCHEMA.md` describes the format and
`configurator\EXTRACT_GUIDE.md` the transcription rules.

## Known limitations

- The specification tables for the single-axis robots (accuracy grades, allowable load
  and torque, the YBSC5 dimension table) are not in the page yet — they sit on
  specification-only pages that the transcription rules skip. Ask if you want them added.
- A few products have an option the catalogue leaves *blank* in the part number
  (for example "no limit switch"). These currently show a placeholder instead of an
  empty gap. Cosmetic, on the fix list.
- On the robot pages the same letter means different things in different positions of
  the code (M is both "motor built-in" and "Mitsubishi"). The labels can read oddly
  until that is fixed.
