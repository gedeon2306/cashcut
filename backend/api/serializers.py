from rest_framework import serializers
from .models import User, Barber, Transaction


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'ville', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # On ne renvoie jamais le MDP en JSON

    def create(self, validated_data):
        # Utilise la méthode create_user définie dans le Manager pour hacher le MDP
        return User.objects.create_user(**validated_data)


class BarberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barber
        fields = ['id', 'barber_name', 'salary', 'created_at', 'user']
        read_only_fields = ['id', 'user', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    # En lecture : on expose les détails complets du barber (objet imbriqué)
    barber = BarberSerializer(read_only=True)
    # En écriture : on accepte juste l'UUID du barber via barber_id
    barber_id = serializers.PrimaryKeyRelatedField(
        queryset=Barber.objects.all(),
        source='barber',
        write_only=True
    )

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'barber', 'barber_id', 'service', 'amount', 'payment_method', 'date', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    # Validation logicielle : montant strictement positif
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le montant doit être supérieur à zéro.")
        return value

    def validate(self, attrs):
        """S'assure que le barber appartient bien à l'utilisateur connecté."""
        request = self.context.get('request')
        barber = attrs.get('barber')
        if request and barber and barber.user != request.user:
            raise serializers.ValidationError(
                {"barber_id": "Ce barbier n'appartient pas à votre compte."}
            )
        return attrs