"use client";
import {Input} from "@/components/ui/input";
import Select from "react-select";
import {Label} from "@/components/ui/label";
import {Button} from '@/components/ui/button'
import makeAnimated from "react-select/animated";
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import {useEffect, useState} from "react";
import {BlogModel} from "@/models/blog";
import {blogService} from "@/app/api/services/blog.Service";
import {useRouter} from "next/navigation";

interface OptionType {
    value: string;
    label: string;
    isFixed?: boolean;
    icon?: string;
}

const mdParser = new MarkdownIt();
mdParser.use(require('markdown-it-ins')); // for underline settings
const BlogComponent: React.FC<BlogModel> = ({
                                                blog_id,
                                                blog_title,
                                                blog_slug,
                                                blog_description,
                                                status_id,
                                            }) => {
    //#region SETTINGS & OPTIONS
    const animatedComponents = makeAnimated();
    const statusData: OptionType[] = [
        {value: "1", label: "Draft"},
        {value: "2", label: "Publish"}
    ];
    const styles = {
        multiValue: (base: any, state: any) => {
            return state.data.isFixed ? {...base, opacity: "0.5"} : base;
        },
        multiValueLabel: (base: any, state: any) => {
            return state.data.isFixed
                ? {...base, color: "#626262", paddingRight: 6}
                : base;
        },
        multiValueRemove: (base: any, state: any) => {
            return state.data.isFixed ? {...base, display: "none"} : base;
        },
        option: (provided: any, state: any) => ({
            ...provided,
            fontSize: "14px",
        }),
    };
    const router = useRouter();
    //#endregion

    //#region STATES
    const [blogTitle, setBlogTitle] = useState(blog_title || '');
    const [blogSlug, setBlogSlug] = useState(blog_slug || '');
    const [blogDescription, setBlogDescription] = useState(blog_description || '');
    const [blogStatus, setBlogStatus] = useState(status_id || '');
    const [redirect, setRedirect] = useState<boolean>(false);
    //#endregion

    //#region FUNCTIONS
    const handleSlugChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = ev.target.value;
        // Türkçe karakterleri İngilizce karşılıklarına çevir
        const turkishMap: { [key: string]: string } = {
            'ç': 'c', 'Ç': 'C',
            'ğ': 'g', 'Ğ': 'G',
            'ı': 'i', 'I': 'I',
            'İ': 'i', 'ş': 's', 'Ş': 'S',
            'ü': 'u', 'Ü': 'U',
            'ö': 'o', 'Ö': 'O',
        };
        const normalizedInput = inputValue
            .replace(/[çÇğĞıİşŞüÜöÖ]/g, (match) => turkishMap[match]) // Türkçe karakterleri değiştir
            .toLowerCase() // Tüm harfleri küçük yap
            .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır (sadece harf, rakam ve tire bırak)
            .trim() // Başı ve sonundaki boşlukları temizle
            .replace(/\s+/g, '-') // Boşlukları "-" ile değiştir
            .replace(/-+/g, '-'); // Birden fazla "-" varsa tek "-" yap

        setBlogSlug(normalizedInput); // Yeni slugu state'e kaydet
    };

    function handleEditorChange({html, text}: any) {
        setBlogDescription(text)
    }

    //#region IMAGE FUNCTIONS
    const handleEditorImageUpload = async (file: any) => {
        const fileSizeInMB = file.size / (1024 * 1024);
        // Eğer dosya 1 MB'tan büyükse hata döndürün
        if (fileSizeInMB > 1) {
            alert("Resim boyutu 1 MB'ı aşmamalıdır.");
            return Promise.reject("Resim boyutu çok büyük");
        }
        const uploadedUrl = await handleImageUpload(file);
        return uploadedUrl;
    };

    const handleImageUpload = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await blogService.uploadImage(formData);

            return response.data;
            // return response.data.imageUrl; // Sunucudan dönen resim URL'si
        } catch (error) {
            console.error('Image upload failed:', error);
            return null;
        }
    };

    //#endregion

    async function handleSubmitForm(ev: any) {
        ev.preventDefault();
        if (blog_id) {
            // update kodu
            await blogService.update(blog_id, blogTitle, blogSlug, blogDescription, blogStatus);
        } else {
            // insert kodu
            await blogService.create(blogTitle, blogSlug, blogDescription, blogStatus);
        }
        setRedirect(true);
    }

    //#endregion

    useEffect(() => {
        // fetchData();
    }, []);


    if (redirect) {
        router.push('/en/blogs');
        return null;
    }

    return (
        <form onSubmit={handleSubmitForm}>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2  flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input type="text" placeholder="Enter small title" id="title" value={blogTitle}
                           onChange={(e) => setBlogTitle(e.target.value)}/>
                </div>
                <div className="col-span-2  flex flex-col gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input type="text" placeholder="Enter slug url" id="slug" value={blogSlug}
                           onChange={handleSlugChange}/>
                </div>
                <div className="col-span-2  flex flex-col gap-2">
                    <Label>Blog Content</Label>
                    <MdEditor style={{width: '100%', height: '400px'}} renderHTML={text => mdParser.render(text)}
                              onChange={handleEditorChange} value={blogDescription}
                              onImageUpload={handleEditorImageUpload}/>
                </div>
                <div className="col-span-2  flex flex-col gap-2">
                    <Label>Status</Label>
                    <Select
                        isClearable={true}
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={statusData}
                        styles={styles}
                        className="react-select"
                        classNamePrefix="select"
                        value={statusData.find(status => status.value === blogStatus) ? {
                            value: blogStatus,
                            label: statusData.find(status => status.value === blogStatus)?.label
                        } : null}
                        onChange={(status: any) => setBlogStatus(status?.value || "")}
                    />
                </div>
                <div className="col-span-2">
                    <Button type="submit">SAVE BLOG</Button>
                </div>
            </div>
        </form>
    )
}


export default BlogComponent;