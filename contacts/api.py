from contacts.models import Contact
from rest_framework import viewsets, permissions
from .serializers import ContactSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from datetime import datetime


class ContactViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Contact.objects.filter(
            posted_by=request.user.id, deletion_date=None)
        serializer = ContactSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        contact = get_object_or_404(
            Contact, pk=pk, posted_by=request.user.id, deletion_date=None)
        serializer = ContactSerializer(contact)
        return Response(serializer.data)

    def create(self, request):
        request.data['posted_by'] = request.user.id
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        contact = get_object_or_404(
            Contact, pk=pk, posted_by=request.user.id, deletion_date=None)

        serializer = ContactSerializer(
            contact, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        contact = get_object_or_404(Contact, pk=pk, posted_by=request.user.id)
        date_today = datetime.now()
        serializer = ContactSerializer(
            contact, data={"deletion_date": date_today}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
