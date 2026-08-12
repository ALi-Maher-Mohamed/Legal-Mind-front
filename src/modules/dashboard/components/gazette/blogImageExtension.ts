import Image from '@tiptap/extension-image';

export type BlogImageAlign = 'right' | 'center' | 'left';

/** TipTap image with width + align attrs for article body. */
export const BlogImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '100%',
        parseHTML: (element) =>
          element.getAttribute('width') ||
          element.style.width ||
          element.getAttribute('data-width') ||
          '100%',
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
            'data-width': attributes.width,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('height') ||
          element.style.height ||
          element.getAttribute('data-height') ||
          null,
        renderHTML: (attributes) => {
          if (!attributes.height || attributes.height === 'auto') return {};
          return {
            height: attributes.height,
            'data-height': attributes.height,
          };
        },
      },
      align: {
        default: 'center' as BlogImageAlign,
        parseHTML: (element) =>
          (element.getAttribute('data-align') as BlogImageAlign) || 'center',
        renderHTML: (attributes) => ({
          'data-align': attributes.align || 'center',
        }),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const width = HTMLAttributes.width || HTMLAttributes['data-width'] || '100%';
    const height =
      HTMLAttributes.height || HTMLAttributes['data-height'] || 'auto';
    const align = (HTMLAttributes['data-align'] ||
      HTMLAttributes.align ||
      'center') as BlogImageAlign;

    const margin =
      align === 'center'
        ? '0.75rem auto'
        : align === 'left'
          ? '0.75rem auto 0.75rem 0'
          : '0.75rem 0 0.75rem auto';

    const { style: _ignored, ...rest } = HTMLAttributes;

    return [
      'img',
      {
        ...rest,
        'data-align': align,
        'data-width': width,
        ...(height && height !== 'auto' ? { 'data-height': height } : {}),
        style: [
          `width: ${width}`,
          `height: ${height === 'auto' || !height ? 'auto' : height}`,
          'max-width: 100%',
          'display: block',
          `margin: ${margin}`,
          'border-radius: 0.75rem',
          'object-fit: contain',
        ].join('; '),
      },
    ];
  },
}).configure({
  inline: false,
  allowBase64: false,
  HTMLAttributes: {
    class: 'blog-content-image',
  },
});
