import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import {
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
} from "@ckeditor/ckeditor5-font";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table";
import { AutoLink, Link } from "@ckeditor/ckeditor5-link";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office";
import { TextTransformation } from "@ckeditor/ckeditor5-typing";
import { CloudServices } from "@ckeditor/ckeditor5-cloud-services";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import PropTypes from "prop-types";
import axios from "axios";
import { message } from "antd";

import {
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from "@ckeditor/ckeditor5-image";
import { Indent } from "@ckeditor/ckeditor5-indent";
import { List } from "@ckeditor/ckeditor5-list";


export default function CkEdit({ onChange, onReady, data }) {
    function customeUploadAdapter(loader) {
        return {
          upload: () => {
            return new Promise((resolve, reject) => {
              const body = new FormData();

              loader.file.then((file) => {
                body.append("file", file);
                body.append("upload_preset", "xreditooo");
                body.append("folder", "editors");
                body.append("api_key", process.env.REACT_APP_CLOUD_API_KEY_CLOUD);
                body.append("api_secret", process.env.REACT_APP_CLOUD_API_SECRET_CLOUD);
                
                const url =
                  "https://api.cloudinary.com/v1_1/" +
                  process.env.REACT_APP_CLOUD_NAME +
                  "/auto/upload";
                const config = {
                  headers: { "content-type": "multipart/form-data" },
                };
      
                if (file.size / 1024 / 1024 > 9) {
                  reject("File not larger than 9MB !");
                  message.error("File not larger than 9MB !");
                } else {
                  axios
                    .post(url, body, config)
                    .then((response) => {
                      resolve({default: response.data.url});
                    })
                    .catch((error) => {
                      console.log(error);
                      reject(error.message);
                    });
                }
              })
            });
          },
        };
      };
    
      const uploadPluginExtra = function (editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
          return new customeUploadAdapter(loader);
        };
      };

  return (
    <CKEditor
      editor={ClassicEditor}
      onReady={onReady}
      config={{
        plugins: [
            Essentials,
            Bold,
            Italic,
            Paragraph,
            FontFamily,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Alignment,
            Heading,
            Table,
            TableToolbar,
            Link,
            AutoLink,
            MediaEmbed,
            Image,
            ImageCaption,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Indent,
            List,
            PasteFromOffice,
            TextTransformation,
            CloudServices,
            BlockQuote,
            uploadPluginExtra
          ],
          toolbar: [
            "bold",
            "italic",
            "|",
            "fontColor",
            "fontBackgroundColor",
            "fontFamily",
            "fontSize",
            "|",
            "alignment",
            "bulletedList",
            "numberedList",
            "heading",
            "|",
            "link",
            "insertTable",
            "mediaEmbed",
            "imageUpload",
            "blockQuote",
            "undo",
            "redo",
            "|",
            "outdent",
            "indent",
          ],
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
      }}
      onChange={onChange}
      data={data}
    />
  );
}

CKEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  onReady: PropTypes.func,
  data: PropTypes.string
};
