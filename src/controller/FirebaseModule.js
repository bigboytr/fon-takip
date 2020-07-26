import firebase from 'firebase'
import store from '@/store/index'
import swal from 'sweetalert2'
import NotifyMe from '@/controller/notifier'


class FirebaseModule {

    constructor(collection, dataMap) {

        this.collection = collection;
        this.dataMap = dataMap; // this is using for getAll method to get data from Firestore
        this.db = firebase.firestore().collection(collection);
    }

    getAll() {
        // this method retrieved data from Firebase then store it vuex

        this.db.where("deleted", "==", false).get().then((snapshot) => {

            return snapshot.docs.map((item) => {
                const extracted = {...this.dataMap} = item.data();

                return {...extracted, id: item.id}
            })
        }).then((list) => {

            store.dispatch('setList', {
                path: this.collection,
                list: list
            });
        })
    }

    getList() {
        // this method return list from vuex
        return store.getters.getList(this.collection);
    }

    save(isUpdate = false, dto) {

        const {id, created, modified, active, deleted} = dto;
        if (id) {
            delete dto.id;
            if (modified === undefined) dto.modified = new Date().toLocaleString();

        } // remove id key from dto
        else {

            if (created === undefined) dto.created = new Date().toLocaleString();
            if (active === undefined) dto.active = true;
            if (deleted === undefined) dto.deleted = false;m
            dto.modified = null
        }


        return new Promise((res, rej) => {

            if (!isUpdate) {
                // new item

                if (id) {
                    this.db.doc(id).set(dto).then(() => {
                        this.getAll()
                        res(true)
                    }).catch(err => rej(err))
                } else {
                    this.db.add(dto).then(() => {
                        this.getAll()
                        res(true)
                    }).catch(err => rej(err))
                }
            }

            else if (isUpdate) {
                this.db.doc(id).update(dto).then(() => {
                    this.getAll();
                    res(true)
                }).catch(err => rej(false))
            }
        })
    }

    uploadFile(file) {

        return new Promise((res, rej) => {

            const ref = firebase.storage().ref();

            // Upload the file and metadata
            let uploadTask = ref.child(`sliders/${file.name}`).put(file);

            uploadTask.on("state_changed", (snapshot) => {

                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    store.dispatch('setProperty', {
                        path: this.collection,
                        prop: "uploadProgress",
                        value: progress
                    });
                },
                (error) => {
                    rej(error)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        res(downloadURL)
                    });
                }
            )
        })

    }

    activeToggle(dto) {

        const isDtoHasRows = this.checkSelectedRowCount(dto);
        if (!isDtoHasRows) return;

        let countS = 0;

        Promise.all(dto.map((item) => (
            this.save(true, {
                id: item.id,
                active: !item.active
            }).then(r => {
                if (r) countS++
            })
        ))).then(() => {
            const message = `${countS} adet öğenin durumu değiştirildi !`
            this.showNotifier('success', message);
        });
    }

    async moveToTrash(dto) {

        const isDtoHasRows = this.checkSelectedRowCount(dto);
        if (!isDtoHasRows) return;

        const res = await swal.fire({
            title: 'Emin misiniz ?',
            text: 'Seçilenler çöpe atılacak !',
            icon: 'warning',
            buttonsStyling: false,
            reverseButtons: true,
            showCancelButton: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-warning mr-3'
            },
            confirmButtonText: 'Çöpe at !',
            cancelButtonText: 'Vazgeç'
        }).then(async function (response) {
            return response.value;
        });

        if (res === true) {

            let countS = 0;
            Promise.all(dto.map((item) => (
                this.save(true, {
                    id: item.id,
                    deleted: true
                }).then(r => {
                    if (r) countS++
                })
            ))).then(() => {
                const message = `${countS} adet öğe çöpe atıldı !`
                this.showNotifier('success', message);

            });
        }
    }

    checkSelectedRowCount(selectedRows) {
        const result = selectedRows.length > 0;

        if (!result) {
            NotifyMe.notifier("warn", "Lütfen en az bir öğe seçin...")
        }

        return result;
    }

    showNotifier(type, txt) {
        NotifyMe.notifier(type, txt);
    }

}

export default FirebaseModule;
