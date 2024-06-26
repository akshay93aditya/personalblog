import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "next-view-transitions";
import React from "react";
import { Children, createElement } from "react";
import { codeToHtml } from "shiki";

function CustomLink({
  href,
  ...props
}: React.ComponentProps<typeof Link> & { href: string }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

function CustomImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={props.alt} className="rounded-lg" {...props} />;
}

async function Pre({
  children,
  ...props
}: React.HtmlHTMLAttributes<HTMLPreElement>) {
  // extract className from the children code tag
  const codeElement = Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === "code",
  ) as React.ReactElement<HTMLPreElement> | undefined;

  const className = codeElement?.props?.className ?? "";
  const isCodeBlock =
    typeof className === "string" && className.startsWith("language-");

  if (isCodeBlock) {
    const lang = className.split(" ")[0]?.split("-")[1] ?? "";

    if (!lang) {
      return <code {...props}>{children}</code>;
    }

    const html = await codeToHtml(String(codeElement?.props.children), {
      lang,
      themes: {
        dark: "vesper",
        light: "vitesse-light",
      },
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // If not, return the component as is
  return <pre {...props}>{children}</pre>;
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  const HeadingComponent = ({ children }: { children: React.ReactNode }) => {
    const childrenString = Children.toArray(children).join("");
    const slug = slugify(childrenString);
    return createElement(`h${level}`, { id: slug }, [
      createElement(
        "a",
        {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        },
        children,
      ),
    ]);
  };
  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
}

const components = {
  a: CustomLink,
  img: CustomImage,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  pre: Pre,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MDX(props: any) {
  return (
    <MDXRemote
      {...props}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      components={{ ...components, ...(props.components ?? {}) }}
    />
  );
}
