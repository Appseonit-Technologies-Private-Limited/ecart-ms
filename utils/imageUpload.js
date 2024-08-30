export const imageUpload = async (files, folder = '/', token, isAvatar = false) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const res = await fetch(`/api/uploads?to=${folder}`, {
        method: "POST",
        body: formData,
        headers: { 'Authorization': token },
        onUploadProgress: (event) =>  console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total))
    });
    const resData = await res.json();
    console.log('res data',resData.data);
    if (res.status == 200 && resData.data) return resData.data;
    else return [];
}