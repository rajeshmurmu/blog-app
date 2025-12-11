import { Editor } from '@tinymce/tinymce-react'
import { Control, Controller } from 'react-hook-form'

export default function RichTextEditor(
    {
        name,
        control,
        label,
        defaultValue = "",
    }: {
        name: string
        control: Control
        label?: string
        defaultValue?: string
    }
) {
    return (
        <div className='w-full '>
            {label && <label className='block mb-2 text-sm font-medium text-gray-900'>{label}</label>}

            <Controller
                name={name || "content"}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange } }) => (
                    <Editor
                        initialValue={defaultValue}
                        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
                        licenseKey="gpl"
                        init={{
                            menubar: true,
                            min_height: 500,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}

                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    )
}
