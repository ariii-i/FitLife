import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { When } from "react-if";
import { useDropzone } from "../../../../components/ui/dropzone";
import { Input } from "../../../../components/ui/input";
import { MUSCLE_GROUP_OPTIONS } from "../../../../entities/exercise/config";
import { IMAGE_PATH_BASE } from "../../../../shared/lib/orpc";

export const NameField = () => {
    const { control, formState } = useFormContext();
    const { errors } = formState;
    return (
        <div className="flex-col gap-4">
            <label className="text-sm text-white ">Name</label>
            <Controller
                control={control}
                name="name"
                render={({ field }) => (
                    <Input
                        id="name"
                        placeholder="e.g. Bench Press"
                        value={field.value || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value.charAt(0).toUpperCase() + value.slice(1))
                        }}
                        className="w-full border-gray-700 h-8 bg-gray-800 rounded-md"
                    />
                )}
            />
            <When condition={!!errors.name}>
                <div className="text-destructive text-sm">
                    {errors?.name?.message + ""}
                </div>
            </When>
        </div>
    );
};

export const DesciptionField = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="flex-col gap-4">
            <label className="text-sm text-white mb-2">Description</label>
            <Controller
                control={control}
                name="description"
                render={({ field }) => (
                    <Input
                        id="description"
                        placeholder="Give some description about the exercise"
                        value={field.value || ""}
                        onChange={(e)=>{
                            const value=e.target.value;
                            field.onChange(value.charAt(0).toUpperCase()+value.slice(1))
                        }}
                        className="w-full border-gray-700 h-8 bg-gray-800 rounded-md"
                    />
                )}
            />
            <When condition={!!errors.description}>
                <div className="text-destructive text-sm">
                    {errors?.description?.message + ""}
                </div>
            </When>
        </div>
    );
};

export const MuscleGroupField = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="flex-col gap-4">
            <label className="text-sm text-white mb-2">Muscle Group</label>
            <Controller
                control={control}
                name="muscle_group"
                render={({ field }) => (
                    <select
                        id="muscle_group"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-md text-white bg-gray-800 border-gray-700 active:outline-none focus:outline-none"
                    >
                        <option value="">Select muscle group</option>
                        {MUSCLE_GROUP_OPTIONS.map((group) => (
                            <option key={group} value={group}>
                                {group.charAt(0).toUpperCase() + group.slice(1)}
                            </option>
                        ))}
                    </select>
                )}
            />
            <When condition={!!errors.muscle_group}>
                <div className="text-destructive text-sm">
                    {errors?.muscle_group?.message + ""}
                </div>
            </When>
        </div>
    );
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export const ImageField = () => {
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const image_path = useWatch({ name: "image_path" });
    const image_base64 = useWatch({ name: "image_base64" });

    const hasExistingImage = image_path && !image_base64;
    const existingImageUrl = hasExistingImage ? `${IMAGE_PATH_BASE}${image_path}` : null;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, []);

    const { getRootProps, getInputProps, onRemoveFile } = useDropzone({
        validation: {
            accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
            maxFiles: 1,
            maxSize: 5 * 1024 * 1024,
        },
        onDropFile: async (file) => {
            const base64 = await fileToBase64(file);
            setValue("image_base64", base64);
            setPreviewUrl(URL.createObjectURL(file));
            return { status: "success" as const, result: base64 };
        },
        onRemoveFile: () => {
            setValue("image_base64", undefined);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        },
    });

    const handleRemove = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        setValue("image_base64", undefined);
        setValue("image_path", undefined);
        onRemoveFile("");
    };

    const showNewFileUpload = !previewUrl && !existingImageUrl;
    const showNewFilePreview = previewUrl;
    const showExistingImage = existingImageUrl && !previewUrl;

    return (
        <div className="flex-col gap-4">
            <label className="text-sm text-white">Image</label>
            <Controller
                control={control}
                name="image_base64"
                render={() => (
                    <div className="space-y-2">
                        {showExistingImage && (
                            <div className="relative w-full h-40 rounded-md border overflow-hidden">
                                <img
                                    src={existingImageUrl}
                                    alt="Existing"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-2 right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {showNewFilePreview && (
                            <div className="relative w-full h-40 rounded-md border overflow-hidden">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-2 right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {showNewFileUpload && (
                            <div
                                {...getRootProps()}
                                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                            >
                                <input {...getInputProps()} />
                                <p className="text-sm text-gray-500">
                                    Click or drag image here
                                </p>
                            </div>
                        )}
                    </div>
                )}
            />
            <When condition={!!errors.image_base64}>
                <div className="text-destructive text-sm">
                    {errors?.image_base64?.message + ""}
                </div>
            </When>
        </div>
    );
};
