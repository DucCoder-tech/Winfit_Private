
        // Show popup after 1 second
        window.addEventListener('load', function() {
            setTimeout(function() {
                gympopOpenModal();
            }, 3000);
        });

        function gympopOpenModal() {
            document.getElementById('gympopModal').classList.add('gympop-active');
            document.body.style.overflow = 'hidden';
        }

        function gympopCloseModal() {
            document.getElementById('gympopModal').classList.remove('gympop-active');
            document.body.style.overflow = '';
        }

        function gympopCloseModalOnOverlay(event) {
            if (event.target.id === 'gympopModal') {
                gympopCloseModal();
            }
        }

        function gympopHandleRegister() {
            alert('Cảm ơn bạn đã quan tâm! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
            gympopCloseModal();
        }

        function gympopHandleLearnMore() {
            alert('Vui lòng liên hệ: 0901 234 567 để biết thêm chi tiết!');
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                gympopCloseModal();
            }
        });
