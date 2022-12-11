import { Renderer } from "marked";

export class KeepSyntaxRenderer extends Renderer {
  paragraph(text: string): string {
    return `<p class="mt-0 mb-0">${text}</p>\n`;
  }
  em(text: string): string {
    return `<em><span class="mutedText">*</span>${text}<span class="mutedText">*</span></em>`;
  }
}
