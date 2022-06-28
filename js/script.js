const books = [];
const RENDER_EVENT = 'render-book';

function generateId() {
  return +new Date();
}
function generateBukuObject(id, buku, penulis, tahun, selesai) {
  return {
    id,
    buku,
    penulis,
    tahun,
    selesai,
  };
}

function cariBuku(bukuId) {
  for (bukuItem of books) {
    if (bukuItem.id === bukuId) {
      return bukuItem;
    }
  }
  return null;
}

function cariBukuIndex(bukuId) {
  for (index in books) {
    if (books[index].id === bukuId) {
      return index;
    }
  }
  return -1;
}

function buatBuku(bukuObject) {
  const { id, buku, penulis, tahun, selesai } = bukuObject;

  const judulBuku = document.createElement('h3');
  judulBuku.innerText = buku;

  const penulisBuku = document.createElement('p');
  penulisBuku.innerText = `Penulis : ${penulis}`;

  const tahunTerbit = document.createElement('p');
  tahunTerbit.innerText = `Tahun : ${tahun}`;

  const container = document.createElement('div');
  container.classList.add('dataBuku');
  container.append(judulBuku, penulisBuku, tahunTerbit);
  container.setAttribute('id', `buku-${id}`);

  if (selesai) {
    const tombolKembali = document.createElement('button');
    tombolKembali.classList.add('hijau');
    tombolKembali.innerText = 'Belum selesai dibaca';
    tombolKembali.addEventListener('click', function () {
      kembalikanBukuDariSelesai(id);
    });

    const tombolHapus = document.createElement('button');
    tombolHapus.classList.add('merah');
    tombolHapus.innerText = 'Hapus Buku';
    tombolHapus.addEventListener('click', function () {
      const hapus = confirm('Apakah anda yakin akan menghapus buku ini ?');
      if (hapus) {
        hapusBuku(id);
      }
    });

    container.append(tombolKembali, tombolHapus);
  } else {
    const tombolSelesai = document.createElement('button');
    tombolSelesai.classList.add('hijau');
    tombolSelesai.innerText = 'Sudah selesai dibaca';
    tombolSelesai.addEventListener('click', function () {
      pindahkanBukuKeSelesai(id);
    });

    const tombolHapus = document.createElement('button');
    tombolHapus.classList.add('merah');
    tombolHapus.innerText = 'Hapus Buku';
    tombolHapus.addEventListener('click', function () {
      const hapus = confirm('Apakah anda yakin akan menghapus buku ini ?');
      if (hapus) {
        hapusBuku(id);
      }
    });

    container.append(tombolSelesai, tombolHapus);
  }

  return container;
}

const SAVED_EVENT = 'buku-tersimpan';
const STORAGE_KEY = 'RAK_BUKU';

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser anda tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const buku of data) {
      books.push(buku);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function tambahBuku() {
  const judulBuku = document.getElementById('buku').value;
  const penulisBuku = document.getElementById('penulis').value;
  const tahunTerbit = document.getElementById('tahun').value;

  const generatedID = generateId();
  const bukuObject = generateBukuObject(generatedID, judulBuku, penulisBuku, tahunTerbit, false);
  books.push(bukuObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function pindahkanBukuKeSelesai(bukuId) {
  const bukuTarget = cariBuku(bukuId);
  if (bukuTarget == null) return;

  bukuTarget.selesai = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function hapusBuku(bukuId) {
  const bukuTarget = cariBukuIndex(bukuId);
  if (bukuTarget === -1) return;
  books.splice(bukuTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function kembalikanBukuDariSelesai(bukuId) {
  const bukuTarget = cariBuku(bukuId);
  if (bukuTarget == null) return;

  bukuTarget.selesai = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBuku');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    tambahBuku();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const belumSelesai = document.getElementById('belumSelesai');
  const sudahSelesai = document.getElementById('sudahSelesai');

  belumSelesai.innerHTML = '<legend>Belum Selesai Dibaca</legend>';
  sudahSelesai.innerHTML = '<legend>Sudah Selesai Dibaca</legend>';

  for (bukuItem of books) {
    const bukuElement = buatBuku(bukuItem);
    if (bukuItem.selesai) {
      sudahSelesai.append(bukuElement);
    } else {
      belumSelesai.append(bukuElement);
    }
  }
});

document.querySelector('#cari').addEventListener('input', filterList);

function filterList() {
  const cariInput = document.querySelector('#cari');
  const filter = cariInput.value.toLowerCase();
  const daftarBuku = document.querySelectorAll('.dataBuku');

  daftarBuku.forEach((buku) => {
    let text = buku.textContent;
    if (text.toLowerCase().includes(filter.toLowerCase())) {
      buku.style.display = '';
    } else {
      buku.style.display = 'none';
    }
  });
}
