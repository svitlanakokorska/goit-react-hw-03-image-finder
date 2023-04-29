import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getSearch } from 'services/pixabay-api';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    imageName: '',
    images: [],
    page: 1,
    total: 1,
    loading: false,
    showModal: false,
    empty: false,
  };
  componentDidUpdate(_, PrevState) {
    if (
      PrevState.imageName !== this.state.imageName ||
      PrevState.page !== this.state.page
    ) {
      this.getFunc(this.state.imageName, this.state.page);
    }
  }

  getFunc = (text, page) => {
    this.setState({ loading: true });

    getSearch(text, page)
      .then(resp => resp.json())
      .then(data => {
        if (data.hits.length === 0) {
          this.setState({ empty: true });
        }
        this.setState(prevSt => ({
          page: prevSt.page,
          images: [...prevSt.images, ...data.hits],
          total: data.total,
        }));
      })
      .catch(error => {
        this.setState({ error: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  clickLoad = () => {
    this.setState(prevSt => ({
      page: prevSt.page + 1,
    }));
  };

  openModal = (largeImageURL, alt) => {
    this.setState(({ showModal }) => {
      return { showModal: !showModal, largeImageURL, alt };
    });
  };

  handleSubmit = imageName => {
    this.setState({
      imageName,
      images: [],
      page: 1,
      total: 1,
      loading: false,
      error: null,
      empty: false,
    });
  };
  closeModal = () => {
    this.setState(({ showModal }) => {
      return { showModal: !showModal };
    });
  };

  render() {
    const { error, loading, images, total, page } = this.state;
    return (
      <div>
        <ToastContainer autoClose={2000} />
        <Searchbar handleSubmit={this.handleSubmit} />
        {error && (
          <h2 style={{ textAlign: 'center' }}>
            Something went wrong: ({error})!
          </h2>
        )}
        <ImageGallery togleModal={this.openModal} images={images} />
        {loading && <Loader />}
        {this.state.empty && (
          <h2 style={{ textAlign: 'center' }}>
            Sorry. There are no images ...
          </h2>
        )}

        {total / 12 > page && <Button clickLoad={this.clickLoad} />}

        {this.state.showModal && (
          <Modal closeModal={this.closeModal}>
            <img src={this.state.largeImageURL} alt={this.state.alt} />
          </Modal>
        )}
      </div>
    );
  }
}
